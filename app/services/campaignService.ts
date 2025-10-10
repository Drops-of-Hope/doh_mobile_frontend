// Campaign service for handling campaign-related API calls
import { apiRequestWithAuth, API_ENDPOINTS } from "./api";
import { useAuthUser } from '../hooks/useAuthUser';
import { useAuth } from '../context/AuthContext';

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
  endTime: string;   // ISO string
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
  endTime: string;   // Should be ISO string from frontend
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

  // Get campaigns for an organizer
  async getOrganizerCampaigns(organizerId: string): Promise<Campaign[]> {
    try {
      console.log("Fetching campaigns for organizer:", organizerId);
      
      let response;
      let usedEndpoint = "";
      
      // Try different endpoint patterns to find one that works
      const endpointsToTry = [
        // Try with query parameter
        { url: `${API_ENDPOINTS.CAMPAIGNS}?organizerId=${organizerId}`, name: "Query Parameter" },
        // Try the organizer-specific endpoint
        { url: `${API_ENDPOINTS.CAMPAIGNS}/organizer/${organizerId}`, name: "Organizer Specific" },
        // Try getting all campaigns first (most likely to work)
        { url: API_ENDPOINTS.CAMPAIGNS, name: "All Campaigns" },
        // Try the my-campaigns endpoint (might work with proper auth)
        { url: API_ENDPOINTS.MY_CAMPAIGNS, name: "My Campaigns" }
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
          console.log(`❌ Failed with ${endpoint.name}:`, error instanceof Error ? error.message : error);
          // Continue to next endpoint
        }
      }
      
      if (!response) {
        console.error("❌ All endpoints failed - no campaigns can be retrieved");
        return [];
      }
      
      console.log(`📡 Successfully used: ${usedEndpoint}`);
      console.log("📦 Raw API Response:", response);
      
      // Handle different response structures
      let campaignsData: any[] = [];
      
      if (response && response.data) {
        // If response.data is an array
        if (Array.isArray(response.data)) {
          campaignsData = response.data;
          console.log(`📋 Found ${campaignsData.length} campaigns in response.data`);
        }
        // If response.data has a campaigns property
        else if (response.data.campaigns && Array.isArray(response.data.campaigns)) {
          campaignsData = response.data.campaigns;
          console.log(`📋 Found ${campaignsData.length} campaigns in response.data.campaigns`);
        }
        // If response.data has other array properties
        else if (response.data.results && Array.isArray(response.data.results)) {
          campaignsData = response.data.results;
          console.log(`📋 Found ${campaignsData.length} campaigns in response.data.results`);
        }
        else {
          console.log("🔍 response.data structure:", Object.keys(response.data));
        }
      }
      // If response itself is an array
      else if (Array.isArray(response)) {
        campaignsData = response;
        console.log(`📋 Response is direct array with ${campaignsData.length} campaigns`);
      }
      
      if (campaignsData.length === 0) {
        console.log("📭 No campaigns found in any data structure");
        return [];
      }
      
      // Log campaign details for debugging
      console.log("🔎 Campaign details:");
      campaignsData.forEach((campaign, index) => {
        // Handle both organizer as string and as object
        let organizerInfo;
        if (typeof campaign.organizer === 'object' && campaign.organizer) {
          // Check if organizer object has id, otherwise use organizerId from campaign root
          const organizerId = campaign.organizer.id || campaign.organizerId;
          organizerInfo = `object {id: ${organizerId}, name: ${campaign.organizer.name}, email: ${campaign.organizer.email}}`;
        } else {
          organizerInfo = campaign.organizer || campaign.organizerId;
        }
        console.log(`  ${index + 1}. ${campaign.title} (organizer: ${organizerInfo})`);
      });
      
      // Filter campaigns by organizerId if we got all campaigns
      let filteredCampaigns = campaignsData;
      
      // Only filter if we seem to have gotten all campaigns (check if we need filtering)
      const hasMultipleOrganizers = campaignsData.length > 1 && 
        new Set(campaignsData.map(c => {
          // Handle both organizer as string and as object
          if (typeof c.organizer === 'object' && c.organizer) {
            // Try organizer.id first, then fall back to campaign.organizerId
            return c.organizer.id || c.organizerId;
          }
          return c.organizer || c.organizerId;
        })).size > 1;
      
      if (hasMultipleOrganizers || usedEndpoint === "All Campaigns") {
        filteredCampaigns = campaignsData.filter(campaign => {
          // Handle both cases: organizer as string ID or as object with id property
          let campaignOrganizerId;
          
          if (typeof campaign.organizer === 'object' && campaign.organizer) {
            // If organizer is an object, try to get id from organizer.id or fall back to campaign.organizerId
            campaignOrganizerId = campaign.organizer.id || campaign.organizerId;
          } else {
            // If organizer is a string or doesn't exist, use it directly or fall back to organizerId
            campaignOrganizerId = campaign.organizer || campaign.organizerId;
          }
          
          // Warn if organizer field has unexpected shape
          if (!campaignOrganizerId) {
            console.warn(`⚠️ Campaign "${campaign.title}" has no organizer ID - organizer:`, campaign.organizer, "organizerId:", campaign.organizerId);
          }
          
          const matches = campaignOrganizerId === organizerId;
          console.log(`🔍 Campaign "${campaign.title}": organizerId="${campaignOrganizerId}" vs target="${organizerId}" => ${matches ? "✅ MATCH" : "❌ NO MATCH"}`);
          
          return matches;
        });
        console.log(`🔽 Filtered from ${campaignsData.length} to ${filteredCampaigns.length} campaigns for organizer ${organizerId}`);
      }
      
      console.log("✅ Final result:", filteredCampaigns);
      return filteredCampaigns || [];
      
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
    campaignData: CampaignForm & { organizerId: string },
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
      return response.data;
    } catch (error) {
      console.error("Failed to fetch campaign stats:", error);
      throw new Error("Failed to fetch campaign statistics");
    }
  }

  // Mark attendance for a participant
  async markAttendance(
    attendanceData: Omit<AttendanceRecord, "id">,
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
          throw new Error("Cannot update campaign: Campaign has started or has linked donations");
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
          throw new Error("Cannot delete campaign: Campaign has started or has linked donations");
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
        type: "MOBILE", // Default type since API doesn't specify
        location: apiData.location || "",
        organizerId: apiData.organizer?.id || "",
        motivation: apiData.description || "",
        description: apiData.description || "",
        
        // Transform date/time fields
        startTime: apiData.startDate || new Date().toISOString(),
        endTime: apiData.endDate || new Date().toISOString(),
        
        // Transform numeric fields
        expectedDonors: apiData.goalBloodUnits || 0,
        actualDonors: apiData.currentBloodUnits || apiData.stats?.currentDonations || 0,
        
        // Contact information from organizer
        contactPersonName: apiData.organizer?.name || "",
        contactPersonPhone: apiData.organizer?.phone || "",
        
        // Status and approval
        isApproved: true, // Assume approved if returned by API
        isActive: apiData.status === 'active',
        status: apiData.status || 'upcoming',
        
        // Medical establishment
        medicalEstablishmentId: apiData.medicalEstablishment?.id || "",
        
        // Timestamps
        createdAt: apiData.createdAt || new Date().toISOString(),
        updatedAt: apiData.updatedAt || new Date().toISOString(),
        
        // Computed UI fields
        hasLinkedDonations: (apiData.stats?.currentDonations || 0) > 0,
        canEdit: apiData.status === 'upcoming' || apiData.status === 'active',
        canDelete: apiData.status === 'upcoming' && (apiData.stats?.currentDonations || 0) === 0,
        currentDonations: apiData.stats?.currentDonations || 0,
        donationGoal: apiData.goalBloodUnits || 0,
        totalAttendance: apiData.stats?.totalAttendance || 0,
        screenedPassed: apiData.stats?.screenedPassed || 0,
        
        // Backward compatibility fields for EditCampaignScreen
        address: apiData.medicalEstablishment?.address || apiData.location || "",
        date: apiData.startDate ? new Date(apiData.startDate).toISOString().split('T')[0] : "",
        contactPerson: apiData.organizer?.name || "",
        contactPhone: apiData.organizer?.phone || "",
        contactEmail: apiData.organizer?.email || "",
        requirements: apiData.requirements ? JSON.stringify(apiData.requirements) : "",
        additionalNotes: "",
      };
      
      console.log("Transformed campaign:", transformedCampaign);
      return transformedCampaign;
      
    } catch (error) {
      console.error("Failed to get campaign details:", error);
      
      // Check if it's a 404 error (campaign not found)
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = error.message as string;
        if (errorMessage.includes('404') || errorMessage.includes('Cannot GET')) {
          
          // Development fallback: Return mock data for testing
          console.warn(`Campaign ${campaignId} not found in backend, using mock data for development`);
          return this.getMockCampaignDetails(campaignId);
        }
      }
      
      throw new Error("Failed to get campaign details");
    }
  }

  // Mock campaign data for development/testing when backend is not available
  private getMockCampaignDetails(campaignId: string): Campaign {
    return {
      id: campaignId,
      title: "Sample Campaign",
      type: "MOBILE",
      location: "Colombo General Hospital",
      organizerId: "user-123",
      motivation: "Community health support",
      description: "This is a sample campaign for development testing.",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
      expectedDonors: 50,
      contactPersonName: "Dr. Sample",
      contactPersonPhone: "0771234567",
      isApproved: true,
      medicalEstablishmentId: "hospital-1",
      actualDonors: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
      updatedAt: new Date().toISOString(),
      
      // UI computed fields
      status: 'upcoming',
      hasLinkedDonations: false,
      canEdit: true,
      canDelete: true,
      donationGoal: 50,
      currentDonations: 0,
      
      // Backward compatibility fields
      address: "No. 1, Regent Street, Colombo 07",
      date: new Date().toISOString().split('T')[0],
      contactPerson: "Dr. Sample",
      contactPhone: "0771234567",
      contactEmail: "dr.sample@hospital.lk",
      additionalNotes: "This is a development mock campaign."
    };
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
      console.error("Failed to check campaign permissions, using fallback logic:", error);
      
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
      if (campaign.status === 'completed') {
        canEdit = false;
        canDelete = false;
        reasons.push('Cannot modify completed campaigns');
      }

      // Check if campaign has linked donations (cannot delete if it has donations)
      if (campaign.hasLinkedDonations || (campaign.currentDonations && campaign.currentDonations > 0)) {
        canDelete = false;
        reasons.push('Cannot delete campaign with linked donations');
      }

      // Active campaigns can be edited but approach with caution
      if (campaign.status === 'active') {
        canEdit = true; // Allow editing active campaigns
        if (campaign.currentDonations && campaign.currentDonations > 0) {
          canDelete = false;
          reasons.push('Cannot delete active campaign with donations');
        }
      }

      // Upcoming campaigns can be freely edited/deleted
      if (campaign.status === 'upcoming') {
        canEdit = true;
        canDelete = true;
      }

      return {
        canEdit,
        canDelete,
        reasons
      };
    } catch (error) {
      console.error("Failed to check campaign permissions with fallback:", error);
      
      // If we can't determine permissions, provide reasonable defaults for development
      console.warn("Using default permissions for development");
      return {
        canEdit: true,
        canDelete: true,
        reasons: []
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
}

export const campaignService = new CampaignService();
export type { Campaign, CampaignForm, AttendanceRecord };
