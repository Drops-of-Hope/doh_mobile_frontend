import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

// Types for explore screen data
export interface ExploreData {
  campaigns: Campaign[];
  emergencies: Emergency[];
  medicalEstablishments: MedicalEstablishment[];
  bloodBanks: BloodBank[];
  statistics: ExploreStatistics;
  filters: ExploreFilters;
}

export interface Campaign {
  id: string;
  title: string;
  type: "FIXED" | "MOBILE";
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  expectedDonors: number;
  actualDonors: number;
  contactPersonName: string;
  contactPersonPhone: string;
  isApproved: boolean;
  isActive: boolean;
  imageUrl?: string;
  requirements?: any;
  createdAt: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  medicalEstablishment: {
    id: string;
    name: string;
    address: string;
    district: string;
  };
  participationStatus?: "NOT_JOINED" | "REGISTERED" | "CONFIRMED" | "ATTENDED" | "COMPLETED";
  availableSlots: number;
  distance?: number; // in km
}

export interface Emergency {
  id: string;
  title: string;
  description: string;
  bloodTypesNeeded: string[];
  quantityNeeded: Record<string, number>;
  urgencyLevel: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  status: "ACTIVE" | "FULFILLED" | "EXPIRED" | "CANCELLED";
  expiresAt: string;
  contactNumber: string;
  specialInstructions?: string;
  createdAt: string;
  hospital: {
    id: string;
    name: string;
    address: string;
    district: string;
  };
  responseCount: number;
  distance?: number; // in km
}

export interface MedicalEstablishment {
  id: string;
  name: string;
  address: string;
  region: string;
  email: string;
  bloodCapacity: number;
  isBloodBank: boolean;
  distance?: number; // in km
  availableSlots?: number;
  operatingHours?: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  district: string;
  email: string;
  bloodCapacity: number;
  currentCapacity?: number;
  distance?: number; // in km
  contactNumber?: string;
  operatingHours?: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface ExploreStatistics {
  totalActiveCampaigns: number;
  totalActiveEmergencies: number;
  totalMedicalEstablishments: number;
  totalBloodBanks: number;
  bloodStock: Record<string, number>; // blood type to units available
  recentDonations: number;
}

export interface ExploreFilters {
  districts: string[];
  campaignTypes: string[];
  urgencyLevels: string[];
  bloodGroups: string[];
  establishmentTypes: string[];
}

export interface ExploreSearchParams {
  query?: string;
  district?: string;
  campaignType?: string;
  urgencyLevel?: string;
  bloodGroup?: string;
  establishmentType?: string;
  radius?: number; // in km
  sortBy?: "distance" | "date" | "urgency" | "capacity";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CampaignJoinRequest {
  campaignId: string;
  specialRequests?: string;
  contactNumber?: string;
}

export interface EmergencyResponse {
  emergencyId: string;
  responseType: "DONATION_OFFER" | "BLOOD_AVAILABILITY" | "VOLUNTEER";
  message?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    preferredContactMethod?: "phone" | "email";
  };
}

// Explore service functions
export const exploreService = {
  // Get complete explore data
  async getExploreData(params?: ExploreSearchParams): Promise<ExploreData> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : "";
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.EXPLORE_DATA}${queryString ? `?${queryString}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch explore data:", error);
      throw error;
    }
  },

  // Get campaigns with filters
  async getCampaigns(params?: ExploreSearchParams): Promise<{
    campaigns: Campaign[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : "";
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}${queryString ? `?${queryString}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      throw error;
    }
  },

  // Get upcoming campaigns
  async getUpcomingCampaigns(params?: ExploreSearchParams): Promise<Campaign[]> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : "";
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.UPCOMING_CAMPAIGNS}${queryString ? `?${queryString}` : ""}`
      );
      return response.data.campaigns;
    } catch (error) {
      console.error("Failed to fetch upcoming campaigns:", error);
      throw error;
    }
  },

  // Get campaign details
  async getCampaignDetails(campaignId: string): Promise<Campaign> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.CAMPAIGN_DETAILS.replace(":id", campaignId)
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch campaign details:", error);
      throw error;
    }
  },

  // Join a campaign
  async joinCampaign(request: CampaignJoinRequest): Promise<{
    success: boolean;
    participationId: string;
    message: string;
  }> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.JOIN_CAMPAIGN.replace(":id", request.campaignId),
        {
          method: "POST",
          body: JSON.stringify({
            specialRequests: request.specialRequests,
            contactNumber: request.contactNumber,
          }),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to join campaign:", error);
      throw error;
    }
  },

  // Get emergencies with filters
  async getEmergencies(params?: ExploreSearchParams): Promise<{
    emergencies: Emergency[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : "";
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.EMERGENCIES}${queryString ? `?${queryString}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch emergencies:", error);
      throw error;
    }
  },

  // Get emergency details
  async getEmergencyDetails(emergencyId: string): Promise<Emergency> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.EMERGENCY_DETAILS.replace(":id", emergencyId)
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch emergency details:", error);
      throw error;
    }
  },

  // Respond to emergency
  async respondToEmergency(response: EmergencyResponse): Promise<{
    success: boolean;
    responseId: string;
    message: string;
  }> {
    try {
      const apiResponse = await apiRequestWithAuth(
        API_ENDPOINTS.RESPOND_EMERGENCY.replace(":id", response.emergencyId),
        {
          method: "POST",
          body: JSON.stringify({
            responseType: response.responseType,
            message: response.message,
            contactInfo: response.contactInfo,
          }),
        }
      );
      return apiResponse.data;
    } catch (error) {
      console.error("Failed to respond to emergency:", error);
      throw error;
    }
  },

  // Get medical establishments
  async getMedicalEstablishments(params?: ExploreSearchParams): Promise<MedicalEstablishment[]> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : "";
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.MEDICAL_ESTABLISHMENTS}${queryString ? `?${queryString}` : ""}`
      );
      return response.data.establishments;
    } catch (error) {
      console.error("Failed to fetch medical establishments:", error);
      throw error;
    }
  },

  // Search all content
  async searchContent(query: string, filters?: Partial<ExploreSearchParams>): Promise<{
    campaigns: Campaign[];
    emergencies: Emergency[];
    establishments: MedicalEstablishment[];
  }> {
    try {
      const params = { query, ...filters };
      const queryString = new URLSearchParams(params as any).toString();
      const response = await apiRequestWithAuth(`/search?${queryString}`);
      return response.data;
    } catch (error) {
      console.error("Failed to search content:", error);
      throw error;
    }
  },

  // Get explore filters
  async getExploreFilters(): Promise<ExploreFilters> {
    try {
      const response = await apiRequestWithAuth("/explore/filters");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch explore filters:", error);
      throw error;
    }
  },

  // Get explore statistics
  async getExploreStatistics(): Promise<ExploreStatistics> {
    try {
      const response = await apiRequestWithAuth("/explore/statistics");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch explore statistics:", error);
      throw error;
    }
  },
};

export default exploreService;
