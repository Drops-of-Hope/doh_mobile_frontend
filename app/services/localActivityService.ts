import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocalActivity {
  id: string;
  type: 'appointment_created' | 'campaign_created' | 'campaign_joined' | 'donation_completed' | 'profile_updated';
  title: string;
  description: string;
  metadata: {
    [key: string]: any;
  };
  timestamp: string;
  userId?: string;
}

export interface ActivityFilter {
  type?: string;
  dateRange?: 'today' | 'week' | 'month' | 'all';
  userId?: string;
  search?: string;
}

const STORAGE_KEY = 'local_activities';

class LocalActivityService {
  /**
   * Record a new activity locally
   */
  async recordActivity(activity: Omit<LocalActivity, 'id' | 'timestamp'>): Promise<void> {
    try {
      const activities = await this.getActivities();
      const newActivity: LocalActivity = {
        ...activity,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      
      activities.unshift(newActivity); // Add to beginning (most recent first)
      
      // Keep only last 100 activities to prevent storage bloat
      const trimmedActivities = activities.slice(0, 100);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedActivities));
    } catch (error) {
      console.error('Failed to record activity:', error);
    }
  }

  /**
   * Get all activities with optional filtering
   */
  async getActivities(filter?: ActivityFilter): Promise<LocalActivity[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let activities: LocalActivity[] = stored ? JSON.parse(stored) : [];

      // Apply filters
      if (filter) {
        activities = this.applyFilters(activities, filter);
      }

      return activities;
    } catch (error) {
      console.error('Failed to get activities:', error);
      return [];
    }
  }

  /**
   * Get recent activities (last 7 days)
   */
  async getRecentActivities(limit: number = 10): Promise<LocalActivity[]> {
    const activities = await this.getActivities({
      dateRange: 'week'
    });
    return activities.slice(0, limit);
  }

  /**
   * Get activities by type
   */
  async getActivitiesByType(type: LocalActivity['type']): Promise<LocalActivity[]> {
    return this.getActivities({ type });
  }

  /**
   * Get activities by user
   */
  async getActivitiesByUser(userId: string): Promise<LocalActivity[]> {
    return this.getActivities({ userId });
  }

  /**
   * Clear all activities
   */
  async clearActivities(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear activities:', error);
    }
  }

  /**
   * Get activity statistics
   */
  async getActivityStats(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byType: Record<string, number>;
  }> {
    const activities = await this.getActivities();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: activities.length,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      byType: {} as Record<string, number>,
    };

    activities.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      
      if (activityDate >= today) {
        stats.today++;
      }
      if (activityDate >= weekAgo) {
        stats.thisWeek++;
      }
      if (activityDate >= monthAgo) {
        stats.thisMonth++;
      }

      stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Apply filters to activities
   */
  private applyFilters(activities: LocalActivity[], filter: ActivityFilter): LocalActivity[] {
    let filtered = [...activities];

    // Filter by type
    if (filter.type && filter.type !== 'all') {
      filtered = filtered.filter(activity => activity.type === filter.type);
    }

    // Filter by date range
    if (filter.dateRange && filter.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate: Date;

      switch (filter.dateRange) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }

      filtered = filtered.filter(activity => 
        new Date(activity.timestamp) >= cutoffDate
      );
    }

    // Filter by user
    if (filter.userId) {
      filtered = filtered.filter(activity => activity.userId === filter.userId);
    }

    // Filter by search term
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm) ||
        activity.description.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  /**
   * Helper methods for recording specific activities
   */
  async recordAppointmentCreated(appointmentId: string, date: string, location: string, userId?: string): Promise<void> {
    await this.recordActivity({
      type: 'appointment_created',
      title: 'Appointment Scheduled',
      description: `Blood donation appointment scheduled for ${date} at ${location}`,
      metadata: {
        appointmentId,
        date,
        location,
      },
      userId,
    });
  }

  async recordCampaignCreated(campaignId: string, title: string, location: string, userId?: string): Promise<void> {
    await this.recordActivity({
      type: 'campaign_created',
      title: 'Campaign Created',
      description: `Created blood donation campaign "${title}" at ${location}`,
      metadata: {
        campaignId,
        campaignTitle: title,
        location,
      },
      userId,
    });
  }

  async recordCampaignJoined(campaignId: string, title: string, location: string, userId?: string): Promise<void> {
    await this.recordActivity({
      type: 'campaign_joined',
      title: 'Joined Campaign',
      description: `Joined blood donation campaign "${title}" at ${location}`,
      metadata: {
        campaignId,
        campaignTitle: title,
        location,
      },
      userId,
    });
  }

  async recordDonationCompleted(donationId: string, location: string, volume: number, userId?: string): Promise<void> {
    await this.recordActivity({
      type: 'donation_completed',
      title: 'Blood Donation Completed',
      description: `Donated ${volume}ml of blood at ${location}`,
      metadata: {
        donationId,
        location,
        volume,
      },
      userId,
    });
  }

  async recordProfileUpdated(changes: string[], userId?: string): Promise<void> {
    await this.recordActivity({
      type: 'profile_updated',
      title: 'Profile Updated',
      description: `Updated profile information: ${changes.join(', ')}`,
      metadata: {
        changes,
      },
      userId,
    });
  }
}

export const localActivityService = new LocalActivityService();