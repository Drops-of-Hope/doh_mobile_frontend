// Campaign-related types
export interface Campaign {
  id: number;
  title: string;
  date: string;
  location: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: "Critical" | "Moderate" | "Low";
}

// Stats types
export interface CampaignStats {
  totalCampaigns: number;
  criticalCount: number;
  moderateCount: number;
  lowCount: number;
  availableSlots: number;
}

// Props types
export interface AllCampaignsScreenProps {
  navigation?: any;
}

export interface CampaignModalProps {
  visible: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onJoin: (campaign: Campaign) => void;
}
