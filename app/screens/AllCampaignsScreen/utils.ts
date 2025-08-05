import { Campaign, CampaignStats } from "./types";

// Mock campaign data
export const getAllCampaigns = (): Campaign[] => [
  // This Week - Nearby (Close)
  {
    id: 1,
    title: "Emergency Relief Fund",
    date: "2025-07-07",
    location: "City General Hospital",
    slotsUsed: 65,
    totalSlots: 100,
    urgency: "Critical",
  },
  {
    id: 2,
    title: "University Blood Drive",
    date: "2025-07-08",
    location: "University of Colombo",
    slotsUsed: 23,
    totalSlots: 50,
    urgency: "Moderate",
  },
  {
    id: 3,
    title: "Community Health Fair",
    date: "2025-07-10",
    location: "Colombo Fort Medical Center",
    slotsUsed: 12,
    totalSlots: 75,
    urgency: "Low",
  },
  {
    id: 4,
    title: "Corporate Wellness Initiative",
    date: "2025-07-14",
    location: "Negombo Business District",
    slotsUsed: 8,
    totalSlots: 30,
    urgency: "Low",
  },
  {
    id: 5,
    title: "School Awareness Program",
    date: "2025-07-16",
    location: "Gampaha District Hospital",
    slotsUsed: 5,
    totalSlots: 40,
    urgency: "Low",
  },
  {
    id: 6,
    title: "National Blood Day Drive",
    date: "2025-07-18",
    location: "Kalutara Medical Center",
    slotsUsed: 45,
    totalSlots: 200,
    urgency: "Moderate",
  },
  {
    id: 7,
    title: "Monsoon Emergency Reserve",
    date: "2025-07-25",
    location: "Kandy Medical Center",
    slotsUsed: 78,
    totalSlots: 120,
    urgency: "Critical",
  },
  {
    id: 8,
    title: "Rural Health Outreach",
    date: "2025-07-28",
    location: "Anuradhapura District Hospital",
    slotsUsed: 15,
    totalSlots: 60,
    urgency: "Moderate",
  },
  {
    id: 9,
    title: "Youth Volunteer Drive",
    date: "2025-08-02",
    location: "Jaffna Teaching Hospital",
    slotsUsed: 22,
    totalSlots: 80,
    urgency: "Low",
  },
  {
    id: 10,
    title: "Religious Festival Support",
    date: "2025-08-05",
    location: "Batticaloa District Hospital",
    slotsUsed: 35,
    totalSlots: 100,
    urgency: "Moderate",
  },
  {
    id: 11,
    title: "Disaster Preparedness Training",
    date: "2025-08-10",
    location: "Matara Base Hospital",
    slotsUsed: 18,
    totalSlots: 90,
    urgency: "Low",
  },
  {
    id: 12,
    title: "International Volunteer Day",
    date: "2025-08-15",
    location: "Galle Teaching Hospital",
    slotsUsed: 55,
    totalSlots: 150,
    urgency: "Moderate",
  },
];

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
