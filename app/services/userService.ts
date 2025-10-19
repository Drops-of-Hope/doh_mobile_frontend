import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

// Types for user data
export interface UserProfile {
  id: string;
  nic: string;
  email: string;
  name: string;
  bloodGroup: string;
  profileImageUrl?: string;
  totalDonations: number;
  totalPoints: number;
  donationBadge: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userDetails?: UserDetails;
}

export interface UserDetails {
  id: string;
  address: string;
  city: string;
  district: string;
  phoneNumber?: string;
  emergencyContact?: string;
  type: string;
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

export interface UpdateProfileData {
  name?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  district?: string;
  emergencyContact?: string;
  profileImageUrl?: string;
}

// User service functions
export const userService = {
  // Get user profile
  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },

  // Get user home stats
  async getUserHomeStats(): Promise<UserHomeStats> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.USER_STATS);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user home stats:", error);
      throw error;
    }
  },

  // Get user activities
  async getUserActivities(page: number = 1, limit: number = 20): Promise<{
    activities: Activity[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_ACTIVITIES}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user activities:", error);
      throw error;
    }
  },

  // Get user notifications
  async getUserNotifications(page: number = 1, limit: number = 20): Promise<{
    notifications: Notification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_NOTIFICATIONS}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user notifications:", error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.UPDATE_PROFILE, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_NOTIFICATIONS}/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_NOTIFICATIONS}/mark-all-read`,
        {
          method: "PATCH",
        }
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },

  // Mark activity as read
  async markActivityAsRead(activityId: string): Promise<void> {
    try {
      await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_ACTIVITIES}/${activityId}/read`,
        {
          method: "PATCH",
        }
      );
    } catch (error) {
      console.error("Failed to mark activity as read:", error);
      throw error;
    }
  },

  // Request Campaign Organizer Role
  // This endpoint communicates with Asgardeo to assign the "Internal/CampaignOrg" role
  async requestCampaignOrganizerRole(): Promise<{
    success: boolean;
    message: string;
    role?: string;
  }> {
    try {
      console.log("📞 Requesting Campaign Organizer role from backend...");
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.REQUEST_CAMPAIGN_ORGANIZER_ROLE,
        {
          method: "POST",
        }
      );
      
      console.log("✅ Role request response:", response);
      return response.data || response;
    } catch (error: any) {
      console.error("❌ Failed to request campaign organizer role:", error);
      throw error;
    }
  },
};

export default userService;
