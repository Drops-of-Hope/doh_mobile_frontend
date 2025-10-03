import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

export interface DonorSearchResult {
  id: string;
  name: string;
  email: string;
  phone?: string;
  nic: string;
  bloodGroup: string;
  totalDonations: number;
  lastDonationDate?: string;
  donationBadge: string;
  eligibleToDonate: boolean;
  eligibilityReason?: string;
  profilePicture?: string;
}

export interface DonorSearchFilters {
  query?: string; // NIC, name, email, or phone
  bloodGroup?: string;
  eligibleOnly?: boolean;
  minDonations?: number;
  page?: number;
  limit?: number;
}

export interface DonorVerificationRequest {
  donorId: string;
  campaignId: string;
  verificationType: "IDENTITY" | "ELIGIBILITY" | "BOTH";
  notes?: string;
}

export interface DonorVerificationResult {
  success: boolean;
  donor: DonorSearchResult;
  verificationDetails: {
    identityVerified: boolean;
    eligibilityVerified: boolean;
    verificationDate: string;
    verifiedBy: string;
  };
  message: string;
}

export interface ManualAttendanceRequest {
  donorId: string;
  campaignId: string;
  attendanceType: "CHECK_IN" | "DONATION_COMPLETED" | "CHECK_OUT";
  isWalkIn?: boolean;
  screeningPassed?: boolean;
  notes?: string;
}

class DonorSearchService {
  // Search for donors by various criteria
  async searchDonors(filters: DonorSearchFilters): Promise<{
    donors: DonorSearchResult[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.query) queryParams.append("q", filters.query);
      if (filters.bloodGroup) queryParams.append("bloodGroup", filters.bloodGroup);
      if (filters.eligibleOnly !== undefined) queryParams.append("eligibleOnly", filters.eligibleOnly.toString());
      if (filters.minDonations !== undefined) queryParams.append("minDonations", filters.minDonations.toString());
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.limit) queryParams.append("limit", filters.limit.toString());

      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USERS}/search?${queryParams.toString()}`,
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

  // Get donor details by ID
  async getDonorDetails(donorId: string): Promise<DonorSearchResult> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USERS}/${donorId}`,
        {
          method: "GET",
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to get donor details:", error);
      throw new Error("Failed to get donor details");
    }
  }

  // Verify donor identity and eligibility
  async verifyDonor(request: DonorVerificationRequest): Promise<DonorVerificationResult> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USERS}/${request.donorId}/verify`,
        {
          method: "POST",
          body: JSON.stringify({
            campaignId: request.campaignId,
            verificationType: request.verificationType,
            notes: request.notes,
          }),
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to verify donor:", error);
      throw new Error("Failed to verify donor");
    }
  }

  // Mark attendance manually
  async markManualAttendance(request: ManualAttendanceRequest): Promise<{
    success: boolean;
    attendance: any;
    message: string;
  }> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}/${request.campaignId}/manual-attendance`,
        {
          method: "POST",
          body: JSON.stringify({
            donorId: request.donorId,
            attendanceType: request.attendanceType,
            isWalkIn: request.isWalkIn || false,
            screeningPassed: request.screeningPassed || false,
            notes: request.notes,
          }),
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to mark manual attendance:", error);
      throw new Error("Failed to mark manual attendance");
    }
  }

  // Get recent donors for quick access
  async getRecentDonors(campaignId?: string, limit: number = 10): Promise<DonorSearchResult[]> {
    try {
      const queryParams = new URLSearchParams();
      if (campaignId) queryParams.append("campaignId", campaignId);
      queryParams.append("limit", limit.toString());

      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USERS}/recent?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to get recent donors:", error);
      throw new Error("Failed to get recent donors");
    }
  }

  // Get frequently donating users
  async getFrequentDonors(limit: number = 20): Promise<DonorSearchResult[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USERS}/frequent?limit=${limit}`,
        {
          method: "GET",
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to get frequent donors:", error);
      throw new Error("Failed to get frequent donors");
    }
  }
}

export const donorSearchService = new DonorSearchService();
export default donorSearchService;