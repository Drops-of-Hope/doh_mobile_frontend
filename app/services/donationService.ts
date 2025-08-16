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

// Enhanced interfaces for donation flow
export interface AttendanceResponse {
  success: boolean;
  campaignTitle?: string;
  message: string;
}

export interface DonationStatusResponse {
  attendanceMarked: boolean;
  formStatus: 'not_filled' | 'filled' | 'submitted';
  screeningStatus: 'pending' | 'in_progress' | 'approved' | 'rejected';
  eligibleForDonation: boolean;
  campaignTitle?: string;
}

export interface DonationFormSubmissionData {
  userId: string;
  formData: DonationFormData;
}

// Donation service functions
export const donationService = {
  // Mark attendance when QR is scanned
  markAttendance: async (userId: string, scannedBy: 'hospital' | 'campaign'): Promise<AttendanceResponse> => {
    return apiRequestWithAuth(API_ENDPOINTS.MARK_ATTENDANCE, {
      method: "POST",
      body: JSON.stringify({ userId, scannedBy }),
    });
  },

  // Get current donation status for user
  getDonationStatus: async (userId: string): Promise<DonationStatusResponse> => {
    return apiRequestWithAuth(`${API_ENDPOINTS.DONATION_FORM}/status/${userId}`, {
      method: "GET",
    });
  },

  // Submit donation form with user ID
  submitDonationForm: async (userId: string, formData: DonationFormData): Promise<any> => {
    return apiRequestWithAuth(API_ENDPOINTS.DONATION_FORM, {
      method: "POST",
      body: JSON.stringify({ userId, formData }),
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

  // Appointment management
  bookAppointment: async (appointmentData: {
    hospitalId: string;
    date: string;
    time: string;
    region: string;
  }): Promise<any> => {
    return apiRequestWithAuth("/api/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  },

  getAppointments: async (): Promise<any[]> => {
    return apiRequestWithAuth("/api/appointments", {
      method: "GET",
    });
  },

  rescheduleAppointment: async (
    appointmentId: string,
    newDate: string,
    newTime: string,
  ): Promise<any> => {
    return apiRequestWithAuth(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      body: JSON.stringify({ date: newDate, time: newTime }),
    });
  },

  cancelAppointment: async (appointmentId: string): Promise<any> => {
    return apiRequestWithAuth(`/api/appointments/${appointmentId}`, {
      method: "DELETE",
    });
  },
};
