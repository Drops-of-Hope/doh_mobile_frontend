// Badge service for fetching badge information from backend
import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

export interface BadgeInfo {
  currentBadge: {
    name: string;
    color: string;
    icon: string;
    gradient: string[];
    description: string;
    badge: string;
  };
  nextBadge: {
    nextBadge: string;
    donationsNeeded: number;
    threshold: number;
  } | null;
  totalDonations: number;
  allBadges: Array<{
    badge: string;
    threshold: number;
    name: string;
    color: string;
    icon: string;
    gradient: string[];
    description: string;
  }>;
}

export interface DonationStatsUpdate {
  user: {
    id: string;
    email: string;
    name: string;
    bloodGroup: string;
    totalDonations: number;
    totalPoints: number;
    donationBadge: string;
    isActive: boolean;
  };
  badgePromoted: boolean;
  oldBadge?: string;
  newBadge?: string;
}

export const badgeService = {
  // Get badge information for a user
  async getBadgeInfo(userId: string): Promise<BadgeInfo> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_PROFILE}/${userId}/badge-info`,
        {
          method: "GET",
        }
      );

      if (response.data) {
        return response.data;
      }

      throw new Error("No badge data received");
    } catch (error) {
      console.error("Failed to fetch badge info:", error);
      throw new Error("Failed to fetch badge information");
    }
  },

  // Update donation stats after a donation is completed
  async updateDonationStats(userId: string, pointsEarned: number = 100): Promise<DonationStatsUpdate> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_PROFILE}/${userId}/donation-completed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pointsEarned }),
        }
      );

      if (response.data) {
        return response.data;
      }

      throw new Error("No donation stats update data received");
    } catch (error) {
      console.error("Failed to update donation stats:", error);
      throw new Error("Failed to update donation statistics");
    }
  },

  // Helper function to get badge display name
  getBadgeDisplayName(badge: string): string {
    switch (badge) {
      case "DIAMOND":
        return "Diamond";
      case "PLATINUM":
        return "Platinum";
      case "GOLD":
        return "Gold";
      case "SILVER":
        return "Silver";
      case "BRONZE":
      default:
        return "Bronze";
    }
  },

  // Helper function to get badge thresholds for progress display
  getBadgeThresholds() {
    return [
      { badge: "BRONZE", threshold: 0, name: "Bronze", description: "Welcome donor - getting started" },
      { badge: "SILVER", threshold: 10, name: "Silver", description: "Dedicated donor - 10+ donations" },
      { badge: "GOLD", threshold: 25, name: "Gold", description: "Champion donor - 25+ donations" },
      { badge: "PLATINUM", threshold: 50, name: "Platinum", description: "Elite donor - 50+ donations" },
      { badge: "DIAMOND", threshold: 100, name: "Diamond", description: "Ultimate donor - 100+ donations" },
    ];
  },

  // Calculate progress to next badge
  calculateBadgeProgress(currentDonations: number, currentBadge: string) {
    const thresholds = this.getBadgeThresholds();
    const currentIndex = thresholds.findIndex(t => t.badge === currentBadge);
    
    if (currentIndex === -1 || currentIndex === thresholds.length - 1) {
      return { progress: 100, nextBadge: null, donationsNeeded: 0 };
    }

    const currentThreshold = thresholds[currentIndex].threshold;
    const nextThreshold = thresholds[currentIndex + 1].threshold;
    const donationsNeeded = nextThreshold - currentDonations;
    const progress = Math.min(100, ((currentDonations - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

    return {
      progress: Math.max(0, progress),
      nextBadge: thresholds[currentIndex + 1],
      donationsNeeded: Math.max(0, donationsNeeded),
    };
  },
};

export default badgeService;