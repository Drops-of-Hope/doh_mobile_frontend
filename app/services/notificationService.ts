import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

export interface CampaignNotification {
  id: string;
  type: "NEW_REGISTRATION" | "ATTENDANCE_MARKED" | "DONATION_COMPLETED" | "CAMPAIGN_STATUS" | "REMINDER" | "ALERT";
  title: string;
  message: string;
  campaignId: string;
  campaignTitle: string;
  userId?: string; // Related user if applicable
  userName?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  metadata?: {
    attendanceCount?: number;
    donationCount?: number;
    eligibilityIssues?: string[];
    actionRequired?: boolean;
    [key: string]: any;
  };
}

export interface NotificationFilters {
  campaignId?: string;
  type?: string[];
  priority?: string[];
  isRead?: boolean;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  notificationTypes: {
    newRegistrations: boolean;
    attendanceUpdates: boolean;
    donationCompletions: boolean;
    campaignStatusChanges: boolean;
    emergencyAlerts: boolean;
    dailySummary: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string;   // HH:MM format
  };
}

class NotificationService {
  // Get notifications for campaign organizer
  async getCampaignNotifications(
    organizerId: string, 
    filters?: NotificationFilters
  ): Promise<{
    notifications: CampaignNotification[];
    unreadCount: number;
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
      queryParams.append("organizerId", organizerId);
      
      if (filters) {
        if (filters.campaignId) queryParams.append("campaignId", filters.campaignId);
        if (filters.type) queryParams.append("type", filters.type.join(","));
        if (filters.priority) queryParams.append("priority", filters.priority.join(","));
        if (filters.isRead !== undefined) queryParams.append("isRead", filters.isRead.toString());
        if (filters.page) queryParams.append("page", filters.page.toString());
        if (filters.limit) queryParams.append("limit", filters.limit.toString());
        if (filters.dateFrom) queryParams.append("dateFrom", filters.dateFrom);
        if (filters.dateTo) queryParams.append("dateTo", filters.dateTo);
      }

      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/campaigns?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to fetch campaign notifications:", error);
      throw new Error("Failed to fetch notifications");
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw new Error("Failed to mark notification as read");
    }
  }

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    try {
      await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/batch-read`,
        {
          method: "PATCH",
          body: JSON.stringify({ notificationIds }),
        }
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      throw new Error("Failed to mark notifications as read");
    }
  }

  // Mark all notifications as read for a campaign
  async markAllAsReadForCampaign(campaignId: string): Promise<void> {
    try {
      await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/campaigns/${campaignId}/read-all`,
        {
          method: "PATCH",
        }
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw new Error("Failed to mark all notifications as read");
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
      throw new Error("Failed to delete notification");
    }
  }

  // Get notification settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/settings`,
        {
          method: "GET",
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to get notification settings:", error);
      throw new Error("Failed to get notification settings");
    }
  }

  // Update notification settings
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/settings`,
        {
          method: "PATCH",
          body: JSON.stringify(settings),
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      throw new Error("Failed to update notification settings");
    }
  }

  // Get unread count for campaigns
  async getUnreadCount(organizerId: string, campaignId?: string): Promise<number> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("organizerId", organizerId);
      if (campaignId) queryParams.append("campaignId", campaignId);

      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/unread-count?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );
      
      return response.data.count;
    } catch (error) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  }

  // Subscribe to real-time notifications (WebSocket)
  async subscribeToNotifications(organizerId: string, campaignIds: string[] = []): Promise<WebSocket | null> {
    try {
      // This would typically use WebSocket for real-time notifications
      // Implementation depends on backend WebSocket setup
      const wsUrl = `ws://localhost:5000/notifications/subscribe?organizerId=${organizerId}&campaigns=${campaignIds.join(',')}`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log("Connected to notification stream");
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      ws.onclose = () => {
        console.log("Disconnected from notification stream");
      };
      
      return ws;
    } catch (error) {
      console.error("Failed to subscribe to notifications:", error);
      return null;
    }
  }

  // Send test notification (for testing purposes)
  async sendTestNotification(campaignId: string, type: string): Promise<void> {
    try {
      await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/test`,
        {
          method: "POST",
          body: JSON.stringify({ campaignId, type }),
        }
      );
    } catch (error) {
      console.error("Failed to send test notification:", error);
      throw new Error("Failed to send test notification");
    }
  }

  // Get notification statistics
  async getNotificationStats(organizerId: string, dateRange?: { from: string; to: string }): Promise<{
    totalNotifications: number;
    unreadNotifications: number;
    notificationsByType: Record<string, number>;
    notificationsByPriority: Record<string, number>;
    averageResponseTime: number; // in minutes
  }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("organizerId", organizerId);
      
      if (dateRange) {
        queryParams.append("from", dateRange.from);
        queryParams.append("to", dateRange.to);
      }

      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.NOTIFICATIONS}/stats?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to get notification stats:", error);
      throw new Error("Failed to get notification stats");
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;