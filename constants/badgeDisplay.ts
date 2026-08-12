// Badge display metadata (icon/color/label), mirroring the backend's
// BadgeService.getBadgeDisplayInfo / OrganizerBadgeService.getTierDisplayInfo.
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

interface BadgeDisplay {
  label: string;
  color: string;
  icon: IconName;
}

export const DONOR_BADGE_DISPLAY: Record<string, BadgeDisplay> = {
  BRONZE: { label: "Bronze Donor", color: "#92400E", icon: "star" },
  SILVER: { label: "Silver Donor", color: "#9CA3AF", icon: "ribbon" },
  GOLD: { label: "Gold Donor", color: "#F59E0B", icon: "medal" },
  PLATINUM: { label: "Platinum Donor", color: "#9CA3AF", icon: "trophy" },
  DIAMOND: { label: "Diamond Donor", color: "#9333EA", icon: "diamond" },
};

export const ORGANIZER_BADGE_DISPLAY: Record<string, BadgeDisplay> = {
  NONE: { label: "New Organizer", color: "#9CA3AF", icon: "flag-outline" },
  HOST: { label: "Host", color: "#0284C7", icon: "flag" },
  SILVER_HOST: { label: "Silver Host", color: "#9CA3AF", icon: "ribbon" },
  GOLD_HOST: { label: "Gold Host", color: "#F59E0B", icon: "medal" },
  PLATINUM_HOST: { label: "Platinum Host", color: "#9CA3AF", icon: "trophy" },
  DIAMOND_HOST: { label: "Diamond Host", color: "#9333EA", icon: "diamond" },
};

export const EMERGENCY_RESPONDER_BADGE_DISPLAY: BadgeDisplay = {
  label: "Emergency Responder",
  color: "#DC2626",
  icon: "medkit",
};
