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

export interface UserDonationData {
  totalDonations: number;
  lastDonationDate?: string;
  daysSinceLastDonation?: number;
  eligibleToDonate: boolean;
  nextEligibleDate?: string;
  bloodGroup: string;
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
  participationStatus?:
    | "NOT_JOINED"
    | "REGISTERED"
    | "CONFIRMED"
    | "ATTENDED"
    | "COMPLETED";
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
  // Get user donation statistics and data
  async getUserDonationData(): Promise<UserDonationData> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.USER_DONATION_HISTORY
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user donation data:", error);
      throw error;
    }
  },

  // Get user eligibility status
  async getUserEligibility(): Promise<DonationEligibility> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.USER_ELIGIBILITY);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user eligibility:", error);
      throw error;
    }
  },

  // Get user's upcoming appointment
  async getUpcomingAppointment(): Promise<Appointment | null> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.USER_APPOINTMENTS + "?status=upcoming&limit=1"
      );
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Failed to fetch upcoming appointment:", error);
      throw error;
    }
  },

  // Get user profile with blood type
  async getUserProfile(): Promise<{
    bloodGroup: string;
    name: string;
    email: string;
  }> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },

  // Get complete home screen data in one call
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
      const response = await apiRequestWithAuth(API_ENDPOINTS.HOME_STATS);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      throw error;
    }
  },

  // Get upcoming appointments
  async getUpcomingAppointments(): Promise<Appointment[]> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.UPCOMING_APPOINTMENTS
      );
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

  // Get user notifications
  async getUserNotifications(limit: number = 10): Promise<Notification[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_NOTIFICATIONS}?limit=${limit}`
      );
      return response.data.notifications;
    } catch (error) {
      console.error("Failed to fetch user notifications:", error);
      throw error;
    }
  },

  // Calculate days since last donation
  calculateDaysSinceLastDonation(lastDonationDate: string): number {
    const lastDate = new Date(lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  // Format appointment for display
  formatAppointmentForDisplay(appointment: Appointment): {
    id: string;
    date: string;
    time: string;
    location: string;
    hospital: string;
    status: string;
  } {
    const appointmentDate = new Date(appointment.appointmentDateTime);
    return {
      id: appointment.id,
      date: appointmentDate.toLocaleDateString(),
      time: appointmentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location:
        appointment.medicalEstablishment?.name ||
        appointment.location ||
        "Unknown Location",
      hospital: appointment.medicalEstablishment?.name || "Unknown Hospital",
      status: appointment.scheduled,
    };
  },
};
