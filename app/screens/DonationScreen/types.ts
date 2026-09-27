// Import existing UserProfile type from service
import { UserProfile as ServiceUserProfile } from "../../services/donationService";

// Extended profile for donation screen with additional fields
export interface ExtendedUserProfile extends ServiceUserProfile {
  bloodType?: string;
  lastDonationDate?: string;
  totalDonations?: number;
  eligibleForDonation?: boolean;
}

// Keep original UserProfile for compatibility
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  lastDonationDate?: string;
  totalDonations: number;
  eligibleForDonation: boolean;
}

// Appointment types
export interface Appointment {
  id: string;
  hospital: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
}

// Tab types
export type TabType = "qr" | "appointment";

// Modal types
export interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
}

export interface DonationFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export interface AppointmentBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onBookAppointment: () => void;
}

// Props types
export interface DonationScreenProps {
  navigation?: any;
}

// Tab content props
export interface TabContentProps {
  activeTab: TabType;
  appointments: Appointment[];
  attendanceMarked: boolean;
  onMarkAttendance: () => void;
  onShowQR: () => void;
  onShowForm: () => void;
  onShowBooking: () => void;
}
