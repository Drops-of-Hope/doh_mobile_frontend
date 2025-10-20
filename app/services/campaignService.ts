// Campaign service for handling campaign-related API calls
import { apiRequestWithAuth, API_ENDPOINTS } from "./api";
import { useAuthUser } from "../hooks/useAuthUser";
import { useAuth } from "../context/AuthContext";

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
      console.log(
        "Fetching campaigns for organizer (STRICT mode):",
        organizerId
      );

      let response;
      let usedEndpoint = "";

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
          console.log(`Trying ${endpoint.name}: ${endpoint.url}`);
          response = await apiRequestWithAuth(endpoint.url, {
            method: "GET",
          });

          console.log(`✅ Success with ${endpoint.name}:`, response);
          usedEndpoint = endpoint.name;
          break; // If successful, exit the loop
        } catch (error) {
          console.log(
            `❌ Failed with ${endpoint.name}:`,
            error instanceof Error ? error.message : error
          );
          // Continue to next endpoint
        }
      }

      if (!response) {
        console.log(
          "❌ All organizer-specific endpoints failed - returning empty array (no fallback)"
        );
        return [];
      }

      // Handle different response structures
      let campaignsData: any[] = [];

      // Check if response has campaigns directly (no .data wrapper)
      if (response && response.campaigns && Array.isArray(response.campaigns)) {
        campaignsData = response.campaigns;
        console.log(
          `📋 Found ${campaignsData.length} campaigns in response.campaigns (direct)`
        );
      }
      // Check if response.data exists and has campaigns
      else if (response && response.data) {
        console.log(
          "🔍 PARSING DEBUG: response.data keys:",
          Object.keys(response.data)
        );
        console.log(
          "🔍 PARSING DEBUG: response.data.campaigns exists:",
          !!response.data.campaigns
        );
        console.log(
          "🔍 PARSING DEBUG: response.data.campaigns is array:",
          Array.isArray(response.data.campaigns)
        );

        // If response.data is an array
        if (Array.isArray(response.data)) {
          campaignsData = response.data;
          console.log(
            `📋 Found ${campaignsData.length} campaigns in response.data`
          );
        }
        // If response.data has a campaigns property
        else if (
          response.data.campaigns &&
          Array.isArray(response.data.campaigns)
        ) {
          campaignsData = response.data.campaigns;
          console.log(
            `📋 Found ${campaignsData.length} campaigns in response.data.campaigns`
          );
        }
        // If response.data has other array properties
        else if (
          response.data.results &&
          Array.isArray(response.data.results)
        ) {
          campaignsData = response.data.results;
          console.log(
            `📋 Found ${campaignsData.length} campaigns in response.data.results`
          );
        } else {
          console.log(
            "🔍 response.data structure:",
            Object.keys(response.data)
          );
          return [];
        }
      }
      // If response itself is an array
      else if (Array.isArray(response)) {
        campaignsData = response;
        console.log(
          `📋 Response is direct array with ${campaignsData.length} campaigns`
        );
      }

      console.log(
        "🔍 FINAL DEBUG: campaignsData length:",
        campaignsData.length
      );
      console.log("🔍 FINAL DEBUG: campaignsData content:", campaignsData);

      if (campaignsData.length === 0) {
        console.log("📭 No campaigns found for this organizer");
        return [];
      }

      // Log campaign details for debugging
      console.log("🔎 Campaign details:");
      campaignsData.forEach((campaign, index) => {
        // Handle both organizer as string and as object
        let organizerInfo;
        if (typeof campaign.organizer === "object" && campaign.organizer) {
          const organizerId = campaign.organizer.id || campaign.organizerId;
          organizerInfo = `object {id: ${organizerId}, name: ${campaign.organizer.name}, email: ${campaign.organizer.email}}`;
        } else {
          organizerInfo = campaign.organizer || campaign.organizerId;
        }
        console.log(
          `  ${index + 1}. ${campaign.title} (organizer: ${organizerInfo})`
        );
      });

      // Since we used organizer-specific endpoints, we can trust the API response
      // No need for additional filtering - the API already filtered by organizerId
      console.log(
        `✅ Returning ${campaignsData.length} campaigns from organizer-specific endpoint`
      );
      console.log("✅ Final result:", campaignsData);

      return campaignsData;
    } catch (error) {
      console.error("❌ Failed to fetch organizer campaigns:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
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
      console.error("Failed to create campaign:", error);
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
      
      const transformedStats: CampaignStats = {
        totalAttendance: participationData.ATTENDED || 0,
        screenedPassed: participationData.screenedPassed || 0,
        walkInsScreened: participationData.walkInsScreened || 0,
        goalProgress: campaignData.actualDonors && campaignData.expectedDonors
          ? Math.round((campaignData.actualDonors / campaignData.expectedDonors) * 100)
          : 0,
        currentDonations: campaignData.actualDonors || 0,
        donationGoal: campaignData.expectedDonors || 0,
      };
      
      console.log("Transformed campaign stats:", transformedStats);
      return transformedStats;
    } catch (error) {
      console.error("Failed to fetch campaign stats:", error);
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
      console.error("Failed to mark attendance:", error);
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
      console.error("Failed to fetch campaign attendance:", error);
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
      console.error("Failed to update campaign:", error);
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
      console.error("Failed to delete campaign:", error);
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
      const apiData = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}`,
        {
          method: "GET",
        }
      );

      console.log("API Response data:", apiData);

      if (!apiData || !apiData.id) {
        throw new Error("Invalid campaign data received from API");
      }

      // Transform backend API format to frontend expected format
      const transformedCampaign: Campaign = {
        id: apiData.id,
        title: apiData.title || "",
        type: apiData.type || "MOBILE",
        location: apiData.location || "",
        organizerId: apiData.organizer?.id || apiData.organizerId || "",
        motivation: apiData.motivation || "",
        description: apiData.description || "",

        // Transform date/time fields
        startTime: apiData.startTime || apiData.startDate || new Date().toISOString(),
        endTime: apiData.endTime || apiData.endDate || new Date().toISOString(),

        // Transform numeric fields
        expectedDonors: apiData.goalBloodUnits || 0,
        actualDonors:
          apiData.currentBloodUnits || apiData.stats?.currentDonations || 0,

        // Contact information from organizer
        contactPersonName: apiData.organizer?.name || "",
        contactPersonPhone: apiData.organizer?.phone || "",

        // Status and approval
        isApproved: true, // Assume approved if returned by API
        isActive: apiData.status === "active",
        status: apiData.status || "upcoming",

        // Medical establishment
        medicalEstablishmentId: apiData.medicalEstablishment?.id || "",

        // Timestamps
        createdAt: apiData.createdAt || new Date().toISOString(),
        updatedAt: apiData.updatedAt || new Date().toISOString(),

        // Computed UI fields
        hasLinkedDonations: (apiData.stats?.currentDonations || 0) > 0,
        canEdit: apiData.status === "upcoming" || apiData.status === "active",
        canDelete:
          apiData.status === "upcoming" &&
          (apiData.stats?.currentDonations || 0) === 0,
        currentDonations: apiData.stats?.currentDonations || 0,
        donationGoal: apiData.goalBloodUnits || 0,
        totalAttendance: apiData.stats?.totalAttendance || 0,
        screenedPassed: apiData.stats?.screenedPassed || 0,

        // Backward compatibility fields for EditCampaignScreen
        address:
          apiData.medicalEstablishment?.address || apiData.location || "",
        date: apiData.startDate
          ? new Date(apiData.startDate).toISOString().split("T")[0]
          : "",
        contactPerson: apiData.organizer?.name || "",
        contactPhone: apiData.organizer?.phone || "",
        contactEmail: apiData.organizer?.email || "",
        requirements: apiData.requirements
          ? JSON.stringify(apiData.requirements)
          : "",
        additionalNotes: "",
      };

      console.log("Transformed campaign:", transformedCampaign);
      return transformedCampaign;
    } catch (error) {
      console.error("Failed to get campaign details:", error);

      // Campaign not found or error occurred
      console.error(`Failed to get campaign details for ${campaignId}:`, error);
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
      return response.data;
    } catch (error) {
      console.error("Failed to get campaign analytics:", error);
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
      console.error(
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
      console.error(
        "Failed to check campaign permissions with fallback:",
        error
      );

      // If we can't determine permissions, provide reasonable defaults for development
      console.warn("Using default permissions for development");
      return {
        canEdit: true,
        canDelete: true,
        reasons: [],
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
      console.error("Failed to search donors:", error);
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
      console.error("Failed to fetch campaign notifications:", error);
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
      console.log("🏥 Joining campaign:", campaignId, "with data:", registrationData);
      
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

      console.log("✅ Campaign registration successful:", response);
      
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
      console.error("❌ Failed to join campaign:", error);
      
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
      console.log("🔍 Checking participation status for campaign:", campaignId);
      
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.CAMPAIGN_PARTICIPATION_STATUS.replace(":id", campaignId),
        {
          method: "GET",
        }
      );
      
      console.log("✅ Participation status response:", response);
      
      return {
        isRegistered: response.data?.isRegistered || false,
        participationId: response.data?.participationId,
        status: response.data?.status,
        registeredAt: response.data?.registeredAt,
      };
    } catch (error) {
      console.error("Failed to check participation status:", error);
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
      console.log("🚪 Leaving campaign:", campaignId);
      
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.LEAVE_CAMPAIGN.replace(":id", campaignId),
        {
          method: "DELETE",
        }
      );
      
      console.log("✅ Successfully left campaign:", response);
      
      return {
        success: true,
        message: response.data?.message || "Successfully unregistered from campaign",
      };
    } catch (error) {
      console.error("❌ Failed to leave campaign:", error);
      throw new Error("Failed to unregister from campaign. Please try again later.");
    }
  }

  // Get total participant count for a campaign
  async getCampaignParticipantCount(
    campaignId: string
  ): Promise<{ success: boolean; count: number }> {
    try {
      console.log("📊 Fetching participant count for campaign:", campaignId);
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
      console.log("📊 Participant count response:", { success, count });

      return { success, count };
    } catch (error) {
      console.error("Failed to fetch participant count:", error);

      // Gracefully handle 404 (route missing or campaign not found) -> return 0
      if (error instanceof Error && (error.message.includes("404") || error.message.includes("Cannot GET"))) {
        console.warn(
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
      console.error("Failed to check registration status:", error);
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
      console.error("Failed to cancel registration:", error);
      throw new Error("Failed to cancel registration");
    }
  }
}

export const campaignService = new CampaignService();
export type { Campaign, CampaignForm, AttendanceRecord };
