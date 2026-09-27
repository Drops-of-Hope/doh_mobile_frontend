export type UrgencyLevel = "Critical" | "Moderate" | "Low";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  location: string;
  hospital: string;
  status: "upcoming" | "completed" | "cancelled";
}

export interface Emergency {
  id: number;
  hospital: string;
  bloodType: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: UrgencyLevel;
  timeLeft: string;
  description?: string;
  contactNumber?: string;
  address?: string;
  requirements?: string;
}

export interface Campaign {
  id: number;
  title: string;
  date: string;
  location: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: UrgencyLevel;
}

export interface CalendarData {
  day: number | null;
  isAvailable?: boolean;
  isPast?: boolean;
  isWeekend?: boolean;
  isToday?: boolean;
  date?: Date;
}

export interface DonationFormData {
  contactNumber: string;
  specialRequests: string;
}

export interface RescheduleFormData {
  preferredDate: string;
  preferredTime: string;
  reason: string;
}
