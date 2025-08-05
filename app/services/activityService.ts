import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

// Types for activity screen data
export interface ActivityData {
  activities: Activity[];
  stats: ActivityStats;
  filters: ActivityFilters;
}

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: ActivityMetadata;
  createdAt: string;
  isRead: boolean;
  relatedData?: {
    campaign?: {
      id: string;
      title: string;
      location: string;
    };
    appointment?: {
      id: string;
      appointmentDateTime: string;
      location: string;
    };
    donation?: {
      id: string;
      pointsEarned: number;
      donationDate: string;
    };
    emergency?: {
      id: string;
      title: string;
      urgencyLevel: string;
    };
  };
}

export interface ActivityMetadata {
  pointsEarned?: number;
  badgeEarned?: string;
  donationId?: string;
  campaignId?: string;
  appointmentId?: string;
  emergencyId?: string;
  qrScanId?: string;
  previousBadge?: string;
  newBadge?: string;
  achievementType?: string;
  milestone?: number;
  [key: string]: any;
}

export interface ActivityStats {
  totalActivities: number;
  activitiesThisWeek: number;
  activitiesThisMonth: number;
  unreadActivities: number;
  activityTypeBreakdown: Record<ActivityType, number>;
  recentAchievements: Achievement[];
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  pointsAwarded?: number;
  badgeAwarded?: string;
}

export interface ActivityFilters {
  types: ActivityType[];
  dateRanges: DateRange[];
  readStatus: ReadStatus[];
}

export interface DateRange {
  label: string;
  value: string;
  startDate?: string;
  endDate?: string;
}

export interface ReadStatus {
  label: string;
  value: "all" | "read" | "unread";
}

export type ActivityType =
  | "DONATION_COMPLETED"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_CANCELLED"
  | "CAMPAIGN_JOINED"
  | "CAMPAIGN_COMPLETED"
  | "QR_SCANNED"
  | "BADGE_EARNED"
  | "POINTS_EARNED"
  | "EMERGENCY_RESPONDED";

export interface ActivitySearchParams {
  type?: ActivityType[];
  dateFrom?: string;
  dateTo?: string;
  isRead?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "type" | "title";
  sortOrder?: "asc" | "desc";
}

export interface DonationHistory {
  donations: DonationRecord[];
  statistics: DonationStatistics;
}

export interface DonationRecord {
  id: string;
  donationDate: string;
  location: string;
  bloodVolume: number;
  pointsEarned: number;
  campaign?: {
    id: string;
    title: string;
    type: string;
  };
  appointment?: {
    id: string;
    appointmentDateTime: string;
  };
  bloodTests?: {
    status: string;
    ABOTest: string;
    hivTest: boolean;
    hemoglobin: number;
    resultPending: boolean;
  };
  feedback?: {
    rating: number;
    comments: string;
  };
}

export interface DonationStatistics {
  totalDonations: number;
  totalPointsEarned: number;
  totalBloodDonated: number; // in ml
  currentBadge: string;
  nextBadge?: string;
  pointsToNextBadge?: number;
  donationStreak: number;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  favoriteLocations: Array<{
    location: string;
    count: number;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    year: number;
    donations: number;
    points: number;
  }>;
}

export interface CampaignHistory {
  participations: CampaignParticipation[];
  statistics: CampaignStatistics;
}

export interface CampaignParticipation {
  id: string;
  campaign: {
    id: string;
    title: string;
    type: string;
    location: string;
    startTime: string;
    endTime: string;
    organizer: {
      name: string;
    };
  };
  registrationDate: string;
  status: string;
  attendanceMarked: boolean;
  donationCompleted: boolean;
  pointsEarned: number;
  feedback?: {
    rating: number;
    comments: string;
  };
  qrScans?: Array<{
    scanType: string;
    scanDateTime: string;
  }>;
}

export interface CampaignStatistics {
  totalParticipations: number;
  completedParticipations: number;
  completionRate: number;
  totalPointsFromCampaigns: number;
  favoriteOrganizers: Array<{
    organizerName: string;
    participations: number;
  }>;
  participationsByType: Record<string, number>;
}

// Activity service functions
export const activityService = {
  // Get all activities with pagination and filters
  async getActivities(params?: ActivitySearchParams): Promise<{
    activities: Activity[];
    stats: ActivityStats;
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
        `${API_ENDPOINTS.USER_ACTIVITIES}${queryString ? `?${queryString}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      throw error;
    }
  },

  // Get activity statistics
  async getActivityStats(): Promise<ActivityStats> {
    try {
      const response = await apiRequestWithAuth(`${API_ENDPOINTS.USER_ACTIVITIES}/stats`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch activity stats:", error);
      throw error;
    }
  },

  // Get donation history
  async getDonationHistory(page: number = 1, limit: number = 20): Promise<{
    history: DonationHistory;
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
        `${API_ENDPOINTS.DONATION_HISTORY}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch donation history:", error);
      throw error;
    }
  },

  // Get campaign participation history
  async getCampaignHistory(page: number = 1, limit: number = 20): Promise<{
    history: CampaignHistory;
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
        `/campaigns/my-participations?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch campaign history:", error);
      throw error;
    }
  },

  // Mark activity as read
  async markActivityAsRead(activityId: string): Promise<void> {
    try {
      await apiRequestWithAuth(`${API_ENDPOINTS.USER_ACTIVITIES}/${activityId}/read`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Failed to mark activity as read:", error);
      throw error;
    }
  },

  // Mark all activities as read
  async markAllActivitiesAsRead(): Promise<void> {
    try {
      await apiRequestWithAuth(`${API_ENDPOINTS.USER_ACTIVITIES}/mark-all-read`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Failed to mark all activities as read:", error);
      throw error;
    }
  },

  // Get activity details
  async getActivityDetails(activityId: string): Promise<Activity> {
    try {
      const response = await apiRequestWithAuth(`${API_ENDPOINTS.USER_ACTIVITIES}/${activityId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch activity details:", error);
      throw error;
    }
  },

  // Get achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await apiRequestWithAuth("/users/achievements");
      return response.data.achievements;
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
      throw error;
    }
  },

  // Get activity filters
  async getActivityFilters(): Promise<ActivityFilters> {
    try {
      const response = await apiRequestWithAuth(`${API_ENDPOINTS.USER_ACTIVITIES}/filters`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch activity filters:", error);
      throw error;
    }
  },

  // Export activity report
  async exportActivityReport(
    params?: ActivitySearchParams,
    format: "csv" | "excel" | "pdf" = "csv"
  ): Promise<{
    downloadUrl: string;
    fileName: string;
  }> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : "";
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_ACTIVITIES}/export?format=${format}${
          queryString ? `&${queryString}` : ""
        }`,
        {
          method: "POST",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to export activity report:", error);
      throw error;
    }
  },

  // Add feedback for donation
  async addDonationFeedback(
    donationId: string,
    rating: number,
    comments?: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiRequestWithAuth(`/donations/${donationId}/feedback`, {
        method: "POST",
        body: JSON.stringify({ rating, comments }),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add donation feedback:", error);
      throw error;
    }
  },

  // Get upcoming appointments
  async getUpcomingAppointments(): Promise<Array<{
    id: string;
    appointmentDateTime: string;
    location: string;
    medicalEstablishment: {
      name: string;
      address: string;
    };
    status: string;
    notes?: string;
  }>> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.UPCOMING_APPOINTMENTS);
      return response.data.appointments;
    } catch (error) {
      console.error("Failed to fetch upcoming appointments:", error);
      throw error;
    }
  },

  // Search activities
  async searchActivities(query: string, filters?: Partial<ActivitySearchParams>): Promise<{
    activities: Activity[];
    totalResults: number;
  }> {
    try {
      const params = { search: query, ...filters };
      const queryString = new URLSearchParams(params as any).toString();
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_ACTIVITIES}/search?${queryString}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to search activities:", error);
      throw error;
    }
  },
};

export default activityService;
