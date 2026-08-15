// Campaign service for handling campaign-related API calls
import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

import { logger } from "../utils/logger";
// Backend API response format (what we actually receive from the server)
interface BackendCampaignResponse {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  goalBloodUnits: number;
  currentBloodUnits: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  organizer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    organization: string;
  };
  medicalEstablishment: {
    id: string;
    name: string;
    address: string;
    contactNumber: string;
  };
  requirements?: {
    ageRange: { min: number; max: number };
    bloodTypes: string[];
    minimumWeight: number;
  };
  stats: {
    currentDonations: number;
    goalProgress: number;
    screenedPassed: number;
    totalAttendance: number;
    totalDonors: number;
  };
}

// Frontend expected format (what our UI components expect)
interface Campaign {
  id: string;
  title: string;
  type: "MOBILE" | "FIXED";
  location: string;
  organizerId: string;
  motivation: string;
  description: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  expectedDonors: number;
  contactPersonName: string;
  contactPersonPhone: string;
  isApproved: boolean;
  medicalEstablishmentId: string;
  bloodbankId?: string;
  actualDonors: number;
  createdAt: string;
  imageUrl?: string;
  isActive: boolean;
  requirements?: any; // JSON field
  updatedAt: string;

  // Computed fields for UI
  donationGoal?: number; // Alias for expectedDonors for backward compatibility
  currentDonations?: number; // Alias for actualDonors
  totalAttendance?: number;
  screenedPassed?: number;
  walkInsScreened?: number;
  status?: "upcoming" | "active" | "completed" | "cancelled";
  canEdit?: boolean;
  canDelete?: boolean;
  hasLinkedDonations?: boolean;

  // Additional fields for backward compatibility
  address?: string;
  date?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  additionalNotes?: string;

  approvalStatus?: {
    status: "approved" | "rejected" | "pending";
    comment?: string;
    reviewedAt?: string;
    reviewedBy?: string;
  };
}

interface CampaignForm {
  title: string;
  type: "MOBILE" | "FIXED";
  location: string;
  motivation: string;
  description: string;
  startTime: string; // Should be ISO string from frontend
  endTime: string; // Should be ISO string from frontend
  expectedDonors: number;
  contactPersonName: string;
  contactPersonPhone: string;
  medicalEstablishmentId: string;
  requirements?: any; // JSON field
}

interface CampaignUpdateForm extends Partial<CampaignForm> {
  id: string;
}

interface CampaignDeletionResult {
  success: boolean;
  message: string;
  notificationsSent: {
    donors: number;
    hospitals: number;
  };
}

interface AttendanceRecord {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  userEmail: string;
  bloodType: string;
  isWalkIn: boolean;
  screeningPassed: boolean;
  timestamp: string;
  markedBy: string; // organizer ID
}

interface CampaignStats {
  totalAttendance: number;
  screenedPassed: number;
  walkInsScreened: number;
  goalProgress: number;
  currentDonations: number;
  donationGoal: number;
}

class CampaignService {
  // Get campaigns for an organizer - STRICT mode: only returns campaigns organized by the specific user
  async getOrganizerCampaigns(organizerId: string): Promise<Campaign[]> {
    try {
      let response;

      // Try only organizer-specific endpoints - NO fallback to all campaigns
      const endpointsToTry = [
        // Try the my-campaigns endpoint first (most specific)
        {
          url: API_ENDPOINTS.MY_CAMPAIGNS.replace(":organizerId", organizerId),
          name: "My Campaigns",
        },
        // Try the organizer-specific endpoint
        {
          url: `${API_ENDPOINTS.CAMPAIGNS}/organizer/${organizerId}`,
          name: "Organizer Specific",
        },
        // Try with query parameter
        {
          url: `${API_ENDPOINTS.CAMPAIGNS}?organizerId=${organizerId}`,
          name: "Query Parameter",
        },
      ];

      for (const endpoint of endpointsToTry) {
        try {
          response = await apiRequestWithAuth(endpoint.url, {
            method: "GET",
          });

          break; // If successful, exit the loop
        } catch (error) {
          // Continue to next endpoint
        }
      }

      if (!response) {
        return [];
      }

      // Handle different response structures
      let campaignsData: any[] = [];

      // Check if response has campaigns directly (no .data wrapper)
      if (response && response.campaigns && Array.isArray(response.campaigns)) {
        campaignsData = response.campaigns;
      }
      // Check if response.data exists and has campaigns
      else if (response && response.data) {
        // If response.data is an array
        if (Array.isArray(response.data)) {
          campaignsData = response.data;
        }
        // If response.data has a campaigns property
        else if (
          response.data.campaigns &&
          Array.isArray(response.data.campaigns)
        ) {
          campaignsData = response.data.campaigns;
        }
        // If response.data has other array properties
        else if (
          response.data.results &&
          Array.isArray(response.data.results)
        ) {
          campaignsData = response.data.results;
        } else {
          return [];
        }
      }
      // If response itself is an array
      else if (Array.isArray(response)) {
        campaignsData = response;
      }

      if (campaignsData.length === 0) {
        return [];
      }

      // Since we used organizer-specific endpoints, we can trust the API response
      // No need for additional filtering - the API already filtered by organizerId
      return campaignsData;
    } catch (error) {
      logger.error("❌ Failed to fetch organizer campaigns:", error);
      if (error instanceof Error) {
        logger.error("Error details:", error.message, error.stack);
      }
      return []; // Return empty array instead of throwing
    }
  }

  // Create a new campaign
  async createCampaign(
    campaignData: CampaignForm & { organizerId: string }
  ): Promise<Campaign> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.CAMPAIGNS, {
        method: "POST",
        body: JSON.stringify(campaignData),
      });
      return response.data;
    } catch (error) {
      logger.error("Failed to create campaign:", error);
      throw new Error("Failed to create campaign");
    }
  }

  // Get campaign statistics
  async getCampaignStats(campaignId: string): Promise<CampaignStats> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}/stats`,
        {
          method: "GET",
        }
      );
      
      // Backend returns: { stats: { campaign: { actualDonors, expectedDonors }, participation: { ATTENDED } } }
      // Transform to match our interface
      const apiData = response.data || response;
      const statsData = apiData.stats || apiData;
      const campaignData = statsData.campaign || {};
      const participationData = statsData.participation || {};
      
      // Attendance covers everyone who showed up, whether or not they went on
      // to donate — the backend advances a participant's status from
      // ATTENDED to COMPLETED once the donation is recorded, so counting
      // ATTENDED alone makes the tile drop by one every time a donation
      // completes.
      const transformedStats: CampaignStats = {
        totalAttendance: (participationData.ATTENDED || 0) + (participationData.COMPLETED || 0),
        screenedPassed: participationData.screenedPassed || 0,
        walkInsScreened: participationData.walkInsScreened || 0,
        goalProgress: campaignData.actualDonors && campaignData.expectedDonors
          ? Math.round((campaignData.actualDonors / campaignData.expectedDonors) * 100)
          : 0,
        currentDonations: campaignData.actualDonors || 0,
        donationGoal: campaignData.expectedDonors || 0,
      };

      return transformedStats;
    } catch (error) {
      logger.error("Failed to fetch campaign stats:", error);
      throw new Error("Failed to fetch campaign statistics");
    }
  }

  // Mark attendance for a participant
  async markAttendance(
    attendanceData: Omit<AttendanceRecord, "id">
  ): Promise<AttendanceRecord> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${attendanceData.campaignId}/attendance`,
        {
          method: "POST",
          body: JSON.stringify(attendanceData),
        }
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to mark attendance:", error);
      throw new Error("Failed to mark attendance");
    }
  }

  // Get attendance records for a campaign
  async getCampaignAttendance(campaignId: string): Promise<AttendanceRecord[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}/attendance`,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to fetch campaign attendance:", error);
      throw new Error("Failed to fetch attendance records");
    }
  }

  // Update campaign
  async updateCampaign(
    campaignId: string,
    updateData: Partial<CampaignForm>
  ): Promise<Campaign> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}`,
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        }
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to update campaign:", error);
      if (error instanceof Error) {
        // Handle specific error messages from backend
        if (error.message.includes("403")) {
          throw new Error(
            "Cannot update campaign: Campaign has started or has linked donations"
          );
        }
        if (error.message.includes("404")) {
          throw new Error("Campaign not found");
        }
      }
      throw new Error("Failed to update campaign");
    }
  }

  // Delete campaign with notifications
  async deleteCampaign(campaignId: string): Promise<CampaignDeletionResult> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}`,
        {
          method: "DELETE",
        }
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to delete campaign:", error);
      if (error instanceof Error) {
        // Handle specific error messages from backend
        if (error.message.includes("403")) {
          throw new Error(
            "Cannot delete campaign: Campaign has started or has linked donations"
          );
        }
        if (error.message.includes("404")) {
          throw new Error("Campaign not found");
        }
      }
      throw new Error("Failed to delete campaign");
    }
  }

  // Get single campaign details
  async getCampaignDetails(campaignId: string): Promise<Campaign> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}`,
        {
          method: "GET",
        }
      );

      // Backend wraps every response as { success, data }; unwrap it the
      // same way getCampaignStats/getCampaignAnalytics do — this endpoint
      // previously read the envelope itself as the campaign, so apiData.id
      // was always undefined and every call fell into "Campaign not found".
      const apiData = response?.data || response;

      if (!apiData || !apiData.id) {
        throw new Error("Invalid campaign data received from API");
      }

      // Compute the upcoming/active/completed/cancelled lifecycle state the
      // same way CampaignDashboardScreen.categorizeByStatus does — the
      // backend has no `status` column, only startTime/endTime/isApproved.
      const isCancelled = apiData.isApproved === "CANCELLED";
      const now = new Date();
      const start = new Date(apiData.startTime);
      const end = new Date(apiData.endTime);
      const lifecycleStatus = isCancelled
        ? "cancelled"
        : now >= start && now <= end
        ? "active"
        : now < start
        ? "upcoming"
        : "completed";

      // Transform backend API format to frontend expected format. GET
      // /campaigns/:id (cloudflare_doh_backend) returns a flat row — id,
      // title, type, location, motivation, description, startTime, endTime,
      // expectedDonors, actualDonors, contactPersonName, contactPersonPhone,
      // medicalEstablishmentId, organizerId, isActive, isApproved (PENDING/
      // ACCEPTED/CANCELLED), requirements, createdAt, plus joined
      // establishmentName/establishmentAddress/organizerName/organizerEmail
      // — there is no nested organizer/medicalEstablishment/stats object.
      const transformedCampaign: Campaign = {
        id: apiData.id,
        title: apiData.title || "",
        type: apiData.type || "MOBILE",
        location: apiData.location || "",
        organizerId: apiData.organizerId || "",
        motivation: apiData.motivation || "",
        description: apiData.description || "",

        startTime: apiData.startTime || new Date().toISOString(),
        endTime: apiData.endTime || new Date().toISOString(),

        expectedDonors: apiData.expectedDonors || 0,
        actualDonors: apiData.actualDonors || 0,

        contactPersonName: apiData.contactPersonName || apiData.organizerName || "",
        contactPersonPhone: apiData.contactPersonPhone || "",

        // Status and approval
        isApproved: apiData.isApproved === "ACCEPTED",
        isActive: Boolean(apiData.isActive),
        status: lifecycleStatus,

        medicalEstablishmentId: apiData.medicalEstablishmentId || "",

        createdAt: apiData.createdAt || new Date().toISOString(),
        updatedAt: apiData.updatedAt || new Date().toISOString(),

        // Computed UI fields
        hasLinkedDonations: (apiData.actualDonors || 0) > 0,
        canEdit: lifecycleStatus === "upcoming" || lifecycleStatus === "active",
        canDelete: lifecycleStatus === "upcoming" && (apiData.actualDonors || 0) === 0,
        currentDonations: apiData.actualDonors || 0,
        donationGoal: apiData.expectedDonors || 0,

        // Backward compatibility fields for EditCampaignScreen
        address: apiData.establishmentAddress || apiData.location || "",
        date: apiData.startTime ? new Date(apiData.startTime).toISOString().split("T")[0] : "",
        contactPerson: apiData.contactPersonName || apiData.organizerName || "",
        contactPhone: apiData.contactPersonPhone || "",
        contactEmail: apiData.organizerEmail || "",
        requirements: apiData.requirements ? JSON.stringify(apiData.requirements) : "",
        additionalNotes: "",
      };

      return transformedCampaign;
    } catch (error) {
      logger.error("Failed to get campaign details:", error);

      // Campaign not found or error occurred
      logger.error(`Failed to get campaign details for ${campaignId}:`, error);
      throw new Error("Failed to get campaign details");
    }
  }

  // Get campaign analytics
  async getCampaignAnalytics(campaignId: string): Promise<{
    totalRegistrations: number;
    totalAttendance: number;
    totalDonations: number;
    donationsByBloodType: Record<string, number>;
    attendanceRate: number;
    donationRate: number;
    dailyStats: Array<{
      date: string;
      registrations: number;
      attendance: number;
      donations: number;
    }>;
    topDonors: Array<{
      id: string;
      name: string;
      donationCount: number;
      bloodGroup: string;
    }>;
  }> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}/analytics`,
        {
          method: "GET",
        }
      );

      // The backend's /analytics endpoint is currently an alias for /stats —
      // it returns { campaign, participation, donations }, not the shape
      // this method promises. Map it here so the analytics screen doesn't
      // reference undefined fields. dailyStats/topDonors have no backend
      // source yet, so they stay empty (the screen already hides those
      // sections when empty).
      const apiData = response.data || response;
      const statsData = apiData.stats || apiData;
      const participationData: Record<string, number> = statsData.participation || {};
      const donationsData = statsData.donations || {};

      const totalRegistrations = Object.values(participationData).reduce(
        (sum: number, count) => sum + (Number(count) || 0),
        0
      );
      // Same ATTENDED+COMPLETED merge as getCampaignStats — COMPLETED means
      // the donor attended *and* donated, not that they never attended.
      const totalAttendance = (participationData.ATTENDED || 0) + (participationData.COMPLETED || 0);
      const totalDonations = Number(donationsData.totalDonations) || 0;

      return {
        totalRegistrations,
        totalAttendance,
        totalDonations,
        donationsByBloodType: donationsData.bloodGroupDistribution || {},
        attendanceRate: totalRegistrations > 0 ? (totalAttendance / totalRegistrations) * 100 : 0,
        donationRate: totalAttendance > 0 ? (totalDonations / totalAttendance) * 100 : 0,
        dailyStats: [],
        topDonors: [],
      };
    } catch (error) {
      logger.error("Failed to get campaign analytics:", error);
      throw new Error("Failed to get campaign analytics");
    }
  }

  // Check if campaign can be edited/deleted
  async checkCampaignPermissions(campaignId: string): Promise<{
    canEdit: boolean;
    canDelete: boolean;
    reasons: string[];
  }> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}/permissions`,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      logger.error(
        "Failed to check campaign permissions, using fallback logic:",
        error
      );

      // Fallback: Use client-side permission logic
      return this.checkCampaignPermissionsFallback(campaignId);
    }
  }

  // Fallback permission checking when API endpoint is not available
  private async checkCampaignPermissionsFallback(campaignId: string): Promise<{
    canEdit: boolean;
    canDelete: boolean;
    reasons: string[];
  }> {
    try {
      // Get campaign details to check ownership and status
      const campaign = await this.getCampaignDetails(campaignId);

      const reasons: string[] = [];
      let canEdit = true;
      let canDelete = true;

      // Check if campaign is completed (cannot edit/delete completed campaigns)
      if (campaign.status === "completed") {
        canEdit = false;
        canDelete = false;
        reasons.push("Cannot modify completed campaigns");
      }

      // Check if campaign is cancelled
      if (campaign.status === "cancelled") {
        canEdit = false;
        canDelete = false;
        reasons.push("Cannot modify cancelled campaigns");
      }

      // Active (live) campaigns CANNOT be edited
      if (campaign.status === "active") {
        canEdit = false; // Prevent editing live campaigns
        canDelete = false;
        reasons.push("Cannot edit live (active) campaigns");
        reasons.push("Cannot delete active campaigns");
      }

      // Check if campaign has linked donations (cannot delete if it has donations)
      if (
        campaign.hasLinkedDonations ||
        (campaign.currentDonations && campaign.currentDonations > 0)
      ) {
        canDelete = false;
        reasons.push("Cannot delete campaign with linked donations");
      }

      // Upcoming campaigns can be freely edited/deleted
      if (campaign.status === "upcoming") {
        canEdit = true;
        canDelete = true;
      }

      return {
        canEdit,
        canDelete,
        reasons,
      };
    } catch (error) {
      logger.error(
        "Failed to check campaign permissions with fallback:",
        error
      );

      // Safety-critical: if permissions can't be determined, deny by default.
      return {
        canEdit: false,
        canDelete: false,
        reasons: ["Could not verify permissions. Check your connection."],
      };
    }
  }

  // Search for donors by NIC or other criteria
  async searchDonors(query: string): Promise<any[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USERS}/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to search donors:", error);
      throw new Error("Failed to search donors");
    }
  }

  // Get campaign notifications for organizer
  async getCampaignNotifications(organizerId: string): Promise<any[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/campaigns?organizerId=${organizerId}`,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to fetch campaign notifications:", error);
      throw new Error("Failed to fetch notifications");
    }
  }

  // Join a campaign (user registration for campaigns)
  async joinCampaign(campaignId: string, registrationData?: {
    contactNumber?: string;
    specialRequests?: string;
    emergencyContact?: string;
  }): Promise<{
    success: boolean;
    participationId: string;
    message: string;
    registrationDetails: {
      campaignId: string;
      userId: string;
      registeredAt: string;
      status: "registered" | "waitlisted";
    };
  }> {
    try {
      const payload = {
        campaignId,
        contactNumber: registrationData?.contactNumber || "",
        specialRequests: registrationData?.specialRequests || "",
        emergencyContact: registrationData?.emergencyContact || "",
        registrationSource: "MOBILE_APP",
        timestamp: new Date().toISOString(),
      };

      const response = await apiRequestWithAuth(
        API_ENDPOINTS.JOIN_CAMPAIGN.replace(":id", campaignId),
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      return {
        success: true,
        participationId: response.data?.participationId || response.data?.id,
        message: response.data?.message || "Successfully registered for campaign",
        registrationDetails: {
          campaignId,
          userId: response.data?.userId || "",
          registeredAt: response.data?.registeredAt || new Date().toISOString(),
          status: response.data?.status || "registered",
        },
      };
    } catch (error) {
      logger.error("❌ Failed to join campaign:", error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes("409") || error.message.includes("already registered")) {
          return {
            success: false,
            participationId: "",
            message: "You are already registered for this campaign",
            registrationDetails: {
              campaignId,
              userId: "",
              registeredAt: "",
              status: "registered",
            },
          };
        }
        
        if (error.message.includes("404")) {
          throw new Error("Campaign not found or no longer available");
        }
        
        if (error.message.includes("403") || error.message.includes("full")) {
          throw new Error("Campaign is full. You have been added to the waitlist.");
        }
      }
      
      throw new Error("Failed to register for campaign. Please try again later.");
    }
  }

  // Check user's registration status for a campaign
  async getCampaignParticipationStatus(campaignId: string): Promise<{
    isRegistered: boolean;
    participationId?: string;
    status?: "REGISTERED" | "CONFIRMED" | "ATTENDED" | "COMPLETED" | "CANCELLED";
    registeredAt?: string;
  }> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.CAMPAIGN_PARTICIPATION_STATUS.replace(":id", campaignId),
        {
          method: "GET",
        }
      );

      return {
        isRegistered: response.data?.isRegistered || false,
        participationId: response.data?.participationId,
        status: response.data?.status,
        registeredAt: response.data?.registeredAt,
      };
    } catch (error) {
      logger.error("Failed to check participation status:", error);
      // If 404, user is not registered
      if (error instanceof Error && error.message.includes("404")) {
        return { isRegistered: false };
      }
      throw error;
    }
  }

  // Leave/Unregister from a campaign
  async leaveCampaign(campaignId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.LEAVE_CAMPAIGN.replace(":id", campaignId),
        {
          method: "DELETE",
        }
      );

      return {
        success: true,
        message: response.data?.message || "Successfully unregistered from campaign",
      };
    } catch (error) {
      logger.error("❌ Failed to leave campaign:", error);
      throw new Error("Failed to unregister from campaign. Please try again later.");
    }
  }

  // Get total participant count for a campaign
  async getCampaignParticipantCount(
    campaignId: string
  ): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.CAMPAIGN_PARTICIPATION_STATUS.replace(":id", campaignId),
        { method: "GET" }
      );

      // Backend shape: { success: true|false, count: number, data: { count: number } }
      const count =
        typeof response?.count === "number"
          ? response.count
          : typeof response?.data?.count === "number"
          ? response.data.count
          : 0;

      const success = Boolean(response?.success);

      return { success, count };
    } catch (error) {
      logger.error("Failed to fetch participant count:", error);

      // Gracefully handle 404 (route missing or campaign not found) -> return 0
      if (error instanceof Error && (error.message.includes("404") || error.message.includes("Cannot GET"))) {
        logger.warn(
          `Participant count endpoint not found for campaign ${campaignId}. Defaulting count to 0.`
        );
        return { success: false, count: 0 };
      }

      // Any other error: still return 0 to avoid breaking UI
      return { success: false, count: 0 };
    }
  }

  // Check user's registration status for a campaign (legacy method - keeping for backward compatibility)
  async getCampaignRegistrationStatus(campaignId: string): Promise<{
    isRegistered: boolean;
    registrationId?: string;
    status?: "registered" | "waitlisted" | "cancelled";
    registeredAt?: string;
  }> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}/my-registration`,
        {
          method: "GET",
        }
      );
      
      return response.data;
    } catch (error) {
      logger.error("Failed to check registration status:", error);
      // If 404, user is not registered
      if (error instanceof Error && error.message.includes("404")) {
        return { isRegistered: false };
      }
      throw error;
    }
  }

  // Cancel campaign registration (legacy method - keeping for backward compatibility)
  async cancelCampaignRegistration(campaignId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}/cancel-registration`,
        {
          method: "DELETE",
        }
      );
      
      return {
        success: true,
        message: "Registration cancelled successfully",
      };
    } catch (error) {
      logger.error("Failed to cancel registration:", error);
      throw new Error("Failed to cancel registration");
    }
  }
}

export const campaignService = new CampaignService();
export type { Campaign, CampaignForm, AttendanceRecord };
