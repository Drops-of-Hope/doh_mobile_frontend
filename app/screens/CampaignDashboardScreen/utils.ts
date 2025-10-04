import { campaignService } from "../../services/campaignService";
import { DashboardStats, CampaignType } from "./types";
import { getDatabaseUserId } from "../../utils/userIdUtils";

export const loadUserCampaigns = async (
  userId: string,
): Promise<CampaignType[]> => {
  try {
    // Get the actual database user ID instead of using the passed userId (which might be auth sub)
    const databaseUserId = await getDatabaseUserId();
    
    if (!databaseUserId) {
      console.error('No database user ID available');
      return [];
    }

    console.log('Loading campaigns for database user ID:', databaseUserId);
    console.log('Original userId parameter was:', userId);
    
    const campaigns = await campaignService.getOrganizerCampaigns(databaseUserId);
    console.log("Loaded campaigns:", campaigns);
    
    // Ensure we always return an array
    if (!campaigns || !Array.isArray(campaigns)) {
      console.warn("Invalid campaigns data received:", campaigns);
      return [];
    }
    
    return campaigns;
  } catch (error) {
    console.error("Failed to load campaigns:", error);
    return []; // Return empty array instead of throwing
  }
};

export const loadCampaignStats = async (
  campaignId: string,
): Promise<DashboardStats> => {
  try {
    return await campaignService.getCampaignStats(campaignId);
  } catch (error) {
    console.error("Failed to load campaign stats:", error);
    // Return mock stats as fallback
    return {
      totalAttendance: 0,
      screenedPassed: 0,
      walkInsScreened: 0,
      goalProgress: 0,
      currentDonations: 0,
      donationGoal: 100,
    };
  }
};

export const formatCampaignDate = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return date;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
      return "#10B981";
    case "pending":
      return "#F59E0B";
    case "completed":
      return "#6B7280";
    case "cancelled":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export const formatProgressPercentage = (progress: number): string => {
  return `${Math.min(Math.max(progress, 0), 100).toFixed(1)}%`;
};
