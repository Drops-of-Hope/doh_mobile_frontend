import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

// Types for home screen data
export interface HomeScreenData {
  userStats: UserHomeStats;
  upcomingAppointments: Appointment[];
  recentActivities: Activity[];
  emergencies: Emergency[];
  featuredCampaigns: Campaign[];
  notifications: Notification[];
  donationEligibility: DonationEligibility;
}

export interface UserHomeStats {
  id: string;
  userId: string;
  nextAppointmentDate?: string;
  nextAppointmentId?: string;
  totalDonations: number;
  totalPoints: number;
  donationStreak: number;
  lastDonationDate?: string;
  eligibleToDonate: boolean;
  nextEligibleDate?: string;
  lastUpdated: string;
}

export interface Appointment {
  id: string;
  donorId: string;
  appointmentDateTime: string;
  location?: string;
  notes?: string;
  scheduled: string;
  createdAt: string;
  medicalEstablishment?: {
    id: string;
    name: string;
    address: string;
    district: string;
  };
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  metadata?: any;
  createdAt: string;
  isRead: boolean;
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
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
  isRead: boolean;
  createdAt: string;
}

export interface DonationEligibility {
  isEligible: boolean;
  nextEligibleDate?: string;
  reasons?: string[];
  recommendations?: string[];
}

// Home service functions
export const homeService = {
  // Get complete home screen data
  async getHomeData(): Promise<HomeScreenData> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.HOME_DATA);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch home data:", error);
      throw error;
    }
  },

  // Get user stats only
  async getUserStats(): Promise<UserHomeStats> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.USER_STATS);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      throw error;
    }
  },

  // Get upcoming appointments
  async getUpcomingAppointments(): Promise<Appointment[]> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.UPCOMING_APPOINTMENTS);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch upcoming appointments:", error);
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_ACTIVITIES}?limit=${limit}&recent=true`
      );
      return response.data.activities;
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
      throw error;
    }
  },

  // Get active emergencies
  async getActiveEmergencies(): Promise<Emergency[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.EMERGENCIES}?status=ACTIVE&limit=5`
      );
      return response.data.emergencies;
    } catch (error) {
      console.error("Failed to fetch active emergencies:", error);
      throw error;
    }
  },

  // Get featured campaigns
  async getFeaturedCampaigns(): Promise<Campaign[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.UPCOMING_CAMPAIGNS}?featured=true&limit=5`
      );
      return response.data.campaigns;
    } catch (error) {
      console.error("Failed to fetch featured campaigns:", error);
      throw error;
    }
  },

  // Get unread notifications
  async getUnreadNotifications(limit: number = 5): Promise<Notification[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_NOTIFICATIONS}?isRead=false&limit=${limit}`
      );
      return response.data.notifications;
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
      throw error;
    }
  },

  // Check donation eligibility
  async checkDonationEligibility(): Promise<DonationEligibility> {
    try {
      const response = await apiRequestWithAuth("/donations/eligibility");
      return response.data;
    } catch (error) {
      console.error("Failed to check donation eligibility:", error);
      throw error;
    }
  },

  // Refresh home data
  async refreshHomeData(): Promise<HomeScreenData> {
    try {
      const response = await apiRequestWithAuth(`${API_ENDPOINTS.HOME_DATA}?refresh=true`);
      return response.data;
    } catch (error) {
      console.error("Failed to refresh home data:", error);
      throw error;
    }
  },
};

export default homeService;
