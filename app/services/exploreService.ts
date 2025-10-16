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
  // Backend may return boolean or enum (PENDING | ACCEPTED | CANCELLED)
  isApproved: boolean | "PENDING" | "ACCEPTED" | "CANCELLED";
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
  featured?: boolean;
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
      // Normalize and sanitize params to match backend expectations
      const normalizedParams: Record<string, string> = {};
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
          // Map UI sort key "date" -> backend field "startTime"
          if (key === "sortBy" && value === "date") {
            normalizedParams[key] = "startTime";
          } else {
            normalizedParams[key] = String(value);
          }
        });
      }

      const queryString = Object.keys(normalizedParams).length
        ? new URLSearchParams(normalizedParams).toString()
        : "";

      const primaryUrl = `${API_ENDPOINTS.UPCOMING_CAMPAIGNS}${queryString ? `?${queryString}` : ""}`;

      // Try primary endpoint first
      let response = await apiRequestWithAuth(primaryUrl);

      // Support multiple possible response shapes
      const primaryData = response?.data?.campaigns || response?.campaigns || response?.data || response;
      if (Array.isArray(primaryData)) return primaryData as Campaign[];

      // If not an array, continue to fallbacks
      throw new Error("Unexpected response shape for upcoming campaigns");
    } catch (error) {
      console.warn("Primary upcoming campaigns endpoint failed, attempting fallbacks...", error);

      // Fallback strategies for compatibility with backend changes
      const fallbackUrls: string[] = [];

      // 1) Try querying the general campaigns endpoint with an explicit status filter
      //    Preserve any existing params
      const baseParams = params ? { ...params } : undefined;
      const qsParts: string[] = [];
      // Always ask for upcoming
      qsParts.push("status=upcoming");
      if (baseParams) {
        Object.entries(baseParams).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
          if (key === "sortBy" && value === "date") {
            qsParts.push(`${key}=startTime`);
          } else {
            qsParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
          }
        });
      }
      fallbackUrls.push(`${API_ENDPOINTS.CAMPAIGNS}?${qsParts.join("&")}`);

      // 2) Try a generic filter parameter some backends use
      fallbackUrls.push(
        `${API_ENDPOINTS.CAMPAIGNS}?filter=upcoming${qsParts.length ? `&${qsParts.filter(p => !p.startsWith("status=")).join("&")}` : ""}`
      );

      // 3) Try the bare upcoming endpoint without params
      fallbackUrls.push(API_ENDPOINTS.UPCOMING_CAMPAIGNS);

      for (const url of fallbackUrls) {
        try {
          const res = await apiRequestWithAuth(url);
          const data = res?.data?.campaigns || res?.campaigns || res?.data || res;
          if (Array.isArray(data)) return data as Campaign[];
        } catch (e) {
          // Continue to next fallback
        }
      }

      // 4) As a last resort: fetch all campaigns and filter on client to upcoming
      try {
        const res = await apiRequestWithAuth(API_ENDPOINTS.CAMPAIGNS);
        const data = res?.data?.campaigns || res?.campaigns || res?.data || res;
        if (Array.isArray(data)) {
          const now = Date.now();
          const parsed = (data as any[]).filter((c) => {
            try {
              const start = new Date(c.startTime || c.startDate || c.start_time).getTime();
              const active = c.isActive !== undefined ? !!c.isActive : true;
              const approved = typeof c.isApproved === "boolean"
                ? c.isApproved
                : typeof c.isApproved === "string"
                ? c.isApproved === "ACCEPTED"
                : typeof c.approvalStatus === "string"
                ? c.approvalStatus === "ACCEPTED"
                : true;
              return Number.isFinite(start) && start >= now && active && approved;
            } catch {
              return false;
            }
          });

          // Sort by start time ascending
          parsed.sort((a, b) => {
            const sa = new Date(a.startTime || a.startDate || a.start_time).getTime();
            const sb = new Date(b.startTime || b.startDate || b.start_time).getTime();
            return sa - sb;
          });

          // Apply limit if provided
          const limit = params?.limit ? Number(params.limit) : undefined;
          const result = limit ? parsed.slice(0, limit) : parsed;
          return result as Campaign[];
        }
      } catch (e) {
        // fall through to rethrow original error
      }

      // If all attempts failed, rethrow the original error
      console.error("Failed to fetch upcoming campaigns after fallbacks.", error);
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
