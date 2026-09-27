import { LucideIcon } from "lucide-react-native";

export interface Appointment {
  id: string;
  hospital: string;
  date: string;
  time: string;
  location: string;
  confirmationId: string;
  status: "upcoming" | "confirmed" | "completed" | "cancelled";
  type: "blood_donation" | "platelet_donation" | "plasma_donation";
  notes?: string;
}

export interface AppointmentScreenProps {
  navigation?: any;
}

export interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  isPast?: boolean;
}

export interface StatusBadgeProps {
  status: Appointment["status"];
}

export interface DetailRowProps {
  icon: LucideIcon;
  text: string;
  tone?: "ink" | "crimson" | "warning" | "danger" | "success";
  isPast?: boolean;
  onCopy?: (message: string) => void;
  copyValue?: string;
}

export interface ActionButtonProps {
  icon: LucideIcon;
  text: string;
  tone: "crimson" | "danger";
  onPress: () => void;
}

export interface EmptyStateProps {
  onBookAppointment?: () => void;
}

export interface SectionHeaderProps {
  icon: LucideIcon;
  tone: "crimson" | "success";
  title: string;
}
