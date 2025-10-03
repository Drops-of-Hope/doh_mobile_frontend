// Campaign service for handling campaign-related API calls
import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

interface Campaign {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  donationGoal: number;
  currentDonations: number;
  totalAttendance: number;
  screenedPassed: number;
  walkInsScreened: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  organizerId: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  requirements?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
  canEdit: boolean; // Computed field from backend
  canDelete: boolean; // Computed field from backend
  hasLinkedDonations: boolean; // Computed field from backend
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
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/organizer/${organizerId}`,
        {
          method: "GET",
        }
      );
      
      console.log("API Response for campaigns:", response);
      
      // Handle different response structures
      if (response && response.data) {
        // If response.data is an array
        if (Array.isArray(response.data)) {
          return response.data;
        }
        
        // If response.data has a campaigns property
        if (response.data.campaigns && Array.isArray(response.data.campaigns)) {
          return response.data.campaigns;
        }
        
        // If response.data has other array properties
        if (response.data.results && Array.isArray(response.data.results)) {
          return response.data.results;
        }
      }
      
      // If response itself is an array
      if (Array.isArray(response)) {
        return response;
      }
      
      console.warn("Unexpected API response structure:", response);
      return []; // Return empty array as fallback
      
    } catch (error) {
      console.error("Failed to fetch organizer campaigns:", error);
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
          method: "PATCH",
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
