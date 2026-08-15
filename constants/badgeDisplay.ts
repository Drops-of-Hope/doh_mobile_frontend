// Badge display metadata (icon/color/label), mirroring the backend's
// BadgeService.getBadgeDisplayInfo / OrganizerBadgeService.getTierDisplayInfo.
import { Star, Award, Medal, Trophy, Gem, Flag, LucideIcon } from "lucide-react-native";

interface BadgeDisplay {
  label: string;
  color: string;
  icon: LucideIcon;
}

// Aligned to app/design/tokens.ts badge tier colors.
export const DONOR_BADGE_DISPLAY: Record<string, BadgeDisplay> = {
  BRONZE: { label: "Bronze Donor", color: "#A56A3A", icon: Star },
  SILVER: { label: "Silver Donor", color: "#8E9196", icon: Award },
  GOLD: { label: "Gold Donor", color: "#C08A2E", icon: Medal },
  PLATINUM: { label: "Platinum Donor", color: "#5E7E8C", icon: Trophy },
  DIAMOND: { label: "Diamond Donor", color: "#6C63B5", icon: Gem },
};

export const ORGANIZER_BADGE_DISPLAY: Record<string, BadgeDisplay> = {
  NONE: { label: "New Organizer", color: "#9C958A", icon: Flag },
  HOST: { label: "Host", color: "#3A6B8A", icon: Flag },
  SILVER_HOST: { label: "Silver Host", color: "#8E9196", icon: Award },
  GOLD_HOST: { label: "Gold Host", color: "#C08A2E", icon: Medal },
  PLATINUM_HOST: { label: "Platinum Host", color: "#5E7E8C", icon: Trophy },
  DIAMOND_HOST: { label: "Diamond Host", color: "#6C63B5", icon: Gem },
};

export const EMERGENCY_RESPONDER_BADGE_DISPLAY: BadgeDisplay = {
  label: "Emergency Responder",
  color: "#C0362C",
  icon: Star,
};
