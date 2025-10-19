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

  // Get live campaigns (startTime passed, endTime not reached yet)
  async getLiveCampaigns(params?: ExploreSearchParams): Promise<{
    campaigns: Campaign[];
    hasMore: boolean;
  }> {
    try {
      const normalizedParams: Record<string, string> = {};
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
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

      try {
        const response = await apiRequestWithAuth(
          `${API_ENDPOINTS.CAMPAIGNS}${queryString ? `?${queryString}` : ""}`
        );
        
        const campaigns = response?.data?.campaigns || response?.campaigns || response?.data || [];
        
        // Filter for live campaigns (started but not ended)
        const now = Date.now();
        const liveCampaigns = campaigns.filter((campaign: any) => {
          // Strip .000Z to prevent UTC conversion - treat times as local
          const startTimeStr = (campaign.startTime || '').replace(/\.000Z$/, '');
          const endTimeStr = (campaign.endTime || '').replace(/\.000Z$/, '');
          const startTime = new Date(startTimeStr).getTime();
          const endTime = new Date(endTimeStr).getTime();
          const isApproved = typeof campaign.isApproved === "boolean"
            ? campaign.isApproved
            : campaign.isApproved === "ACCEPTED";
          
          const isLive = startTime <= now && endTime > now && campaign.isActive && isApproved;
          if (isLive) {
            console.log(`✅ Live campaign found: ${campaign.title}`, {
              startTime: startTimeStr,
              endTime: endTimeStr,
              now: new Date(now).toISOString()
            });
          }
          return isLive;
        });

        // Apply limit if specified
        const limit = params?.limit ? Number(params.limit) : undefined;
        const result = limit ? liveCampaigns.slice(0, limit) : liveCampaigns;
        
        return {
          campaigns: result,
          hasMore: limit ? liveCampaigns.length > limit : false,
        };
      } catch (error) {
        console.error("Failed to fetch live campaigns:", error);
        return { campaigns: [], hasMore: false };
      }
    } catch (error) {
      console.error("Failed to fetch live campaigns:", error);
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
      
      // Only return if we have a non-empty array, otherwise trigger fallbacks
      if (Array.isArray(primaryData) && primaryData.length > 0) {
        return primaryData as Campaign[];
      }

      // If empty array or not an array, continue to fallbacks
      console.log("Primary endpoint returned empty or invalid data, trying fallbacks...");
      throw new Error("No campaigns found in primary endpoint");
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
          if (Array.isArray(data) && data.length > 0) {
            console.log(`Fallback successful: ${url} returned ${data.length} campaigns`);
            return data as Campaign[];
          }
        } catch (e) {
          // Continue to next fallback
          console.log(`Fallback failed: ${url}`, e);
        }
      }

      // 4) As a last resort: fetch all campaigns and filter on client
      // For development: show active campaigns even if they're in the past
      try {
        console.log("Attempting final fallback: fetching all campaigns...");
        const res = await apiRequestWithAuth(API_ENDPOINTS.CAMPAIGNS);
        const data = res?.data?.campaigns || res?.campaigns || res?.data || res;
        if (Array.isArray(data)) {
          const now = Date.now();
          
          // First, try to get truly upcoming campaigns (future, active, approved)
          let filtered = (data as any[]).filter((c) => {
            try {
              // Strip .000Z to prevent UTC conversion - treat times as local
              const startTimeStr = (c.startTime || c.startDate || c.start_time || '').replace(/\.000Z$/, '');
              const start = new Date(startTimeStr).getTime();
              const active = c.isActive !== undefined ? !!c.isActive : true;
              const approved = typeof c.isApproved === "boolean"
                ? c.isApproved
                : typeof c.isApproved === "string"
                ? c.isApproved === "ACCEPTED"
                : typeof c.approvalStatus === "string"
                ? c.approvalStatus === "ACCEPTED"
                : true;
              
              const isUpcoming = Number.isFinite(start) && start > now && active && approved;
              if (isUpcoming) {
                console.log(`✅ Upcoming campaign found: ${c.title}`, {
                  startTime: startTimeStr,
                  now: new Date(now).toISOString()
                });
              }
              return isUpcoming;
            } catch {
              return false;
            }
          });

          // If no upcoming campaigns, for development purposes, show all active campaigns
          // (even if in the past or pending approval)
          if (filtered.length === 0) {
            console.log("No truly upcoming campaigns found. Showing all active campaigns for development.");
            filtered = (data as any[]).filter((c) => {
              const active = c.isActive !== undefined ? !!c.isActive : true;
              return active;
            });
          }

          // Sort by start time ascending
          filtered.sort((a, b) => {
            try {
              // Strip .000Z to prevent UTC conversion
              const saStr = (a.startTime || a.startDate || a.start_time || '').replace(/\.000Z$/, '');
              const sbStr = (b.startTime || b.startDate || b.start_time || '').replace(/\.000Z$/, '');
              const sa = new Date(saStr).getTime();
              const sb = new Date(sbStr).getTime();
              return sa - sb;
            } catch {
              return 0;
            }
          });

          // Apply limit if provided
          const limit = params?.limit ? Number(params.limit) : undefined;
          const result = limit ? filtered.slice(0, limit) : filtered;
          
          console.log(`Final fallback: returning ${result.length} campaigns`);
          return result as Campaign[];
        }
      } catch (e) {
        console.error("Final fallback failed:", e);
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
