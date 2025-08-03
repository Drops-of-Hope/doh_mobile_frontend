import { Campaign as CampaignType } from "../../services/campaignService";

export interface DashboardStats {
  totalAttendance: number;
  screenedPassed: number;
  walkInsScreened: number;
  goalProgress: number;
  currentDonations: number;
  donationGoal: number;
}

export interface CampaignDashboardScreenProps {
  navigation?: any;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export interface ProgressBarProps {
  progress: number;
  color: string;
}

export interface CampaignSelectorProps {
  activeCampaign: CampaignType | null;
  campaigns: CampaignType[];
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectCampaign: (campaign: CampaignType) => void;
}

export interface QRSectionProps {
  onScanQR: () => void;
}

export interface AnalyticsSectionProps {
  stats: DashboardStats;
}

export interface DashboardHeaderProps {
  title: string;
  onBack: () => void;
  onAdd: () => void;
}

export { CampaignType };
