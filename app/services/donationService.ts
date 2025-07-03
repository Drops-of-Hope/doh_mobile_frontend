import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

// User profile interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  uid: string;
}

// Donation form data interface
export interface DonationFormData {
  anyDifficulty: boolean;
  medicalAdvice: boolean;
  feelingWell: boolean;
  takingMedicines: boolean;
  anySurgery: boolean;
  pregnant: boolean;
  haveHepatitis: boolean;
  tattoos: boolean;
  travelledAbroad: boolean;
  receivedBlood: boolean;
  chemotherapy: boolean;
  bookAspin: boolean;
  knowledgeAgent: boolean;
  feverLymphNode: boolean;
}

// Donation service functions
export const donationService = {
  // Submit donation form
  submitDonationForm: async (formData: DonationFormData): Promise<any> => {
    return apiRequestWithAuth(API_ENDPOINTS.DONATION_FORM, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  // Join campaign
  joinCampaign: async (campaignId: string): Promise<any> => {
    return apiRequestWithAuth(API_ENDPOINTS.JOIN_CAMPAIGN, {
      method: "POST",
      body: JSON.stringify({ campaignId }),
    });
  },

  // Get user profile for QR code
  getUserProfile: async (): Promise<UserProfile> => {
    return apiRequestWithAuth(API_ENDPOINTS.USER_PROFILE, {
      method: "GET",
    });
  },

  // Get campaigns
  getCampaigns: async (): Promise<any[]> => {
    return apiRequestWithAuth(API_ENDPOINTS.CAMPAIGNS, {
      method: "GET",
    });
  },

  // Get donation history
  getDonationHistory: async (): Promise<any[]> => {
    return apiRequestWithAuth("/api/donations/history", {
      method: "GET",
    });
  },
};
