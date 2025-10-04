// Campaign service for handling campaign-related API calls
import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

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
        // Try getting all campaigns first (most likely to work)
        { url: API_ENDPOINTS.CAMPAIGNS, name: "All Campaigns" },
        // Try with query parameter
        { url: `${API_ENDPOINTS.CAMPAIGNS}?organizerId=${organizerId}`, name: "Query Parameter" },
        // Try the organizer-specific endpoint
        { url: `${API_ENDPOINTS.CAMPAIGNS}/organizer/${organizerId}`, name: "Organizer Specific" },
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
        const organizerInfo = typeof campaign.organizer === 'object' && campaign.organizer 
          ? `object with id: ${campaign.organizer.id}` 
          : campaign.organizer || campaign.organizerId;
        console.log(`  ${index + 1}. ${campaign.title} (organizer: ${organizerInfo})`);
      });
      
      // Filter campaigns by organizerId if we got all campaigns
      let filteredCampaigns = campaignsData;
      
      // Only filter if we seem to have gotten all campaigns (check if we need filtering)
      const hasMultipleOrganizers = campaignsData.length > 1 && 
        new Set(campaignsData.map(c => {
          // Handle both organizer as string and as object
          return typeof c.organizer === 'object' && c.organizer 
            ? c.organizer.id 
            : c.organizer || c.organizerId;
        })).size > 1;
      
      if (hasMultipleOrganizers || usedEndpoint === "All Campaigns") {
        filteredCampaigns = campaignsData.filter(campaign => {
          // Handle both cases: organizer as string ID or as object with id property
          const campaignOrganizerId = typeof campaign.organizer === 'object' && campaign.organizer
            ? campaign.organizer.id
            : campaign.organizer || campaign.organizerId;
          
          // Warn if organizer field has unexpected shape
          if (!campaignOrganizerId) {
            console.warn(`⚠️ Campaign "${campaign.title}" has unexpected organizer shape:`, campaign.organizer);
          }
          
          return campaignOrganizerId === organizerId;
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
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${campaignId}`,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get campaign details:", error);
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
      console.error("Failed to check campaign permissions:", error);
      throw new Error("Failed to check campaign permissions");
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
