import { Campaign, CampaignStats } from "./types";

// Calculate campaign statistics
export const getCampaignStats = (campaigns: Campaign[]): CampaignStats => {
  const totalCampaigns = campaigns.length;
  const criticalCount = campaigns.filter(
    (c) => c.urgency === "Critical",
  ).length;
  const moderateCount = campaigns.filter(
    (c) => c.urgency === "Moderate",
  ).length;
  const lowCount = campaigns.filter((c) => c.urgency === "Low").length;
  const availableSlots = campaigns.reduce(
    (sum, c) => sum + (c.totalSlots - c.slotsUsed),
    0,
  );

  return {
    totalCampaigns,
    criticalCount,
    moderateCount,
    lowCount,
    availableSlots,
  };
};

// Format date for display
export const formatCampaignDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 14) return "Next week";
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
  return date.toLocaleDateString();
};

// Get urgency color
export const getUrgencyColor = (urgency: Campaign["urgency"]): string => {
  switch (urgency) {
    case "Critical":
      return "#EF4444";
    case "Moderate":
      return "#F97316";
    case "Low":
      return "#10B981";
    default:
      return "#6B7280";
  }
};
