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
  icon: string;
  text: string;
  color?: string;
  isPast?: boolean;
  onCopy?: (message: string) => void;
  copyValue?: string;
}

export interface ActionButtonProps {
  icon: string;
  text: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  onPress: () => void;
}

export interface EmptyStateProps {
  onBookAppointment?: () => void;
}

export interface SectionHeaderProps {
  icon: string;
  iconColor: string;
  title: string;
}
