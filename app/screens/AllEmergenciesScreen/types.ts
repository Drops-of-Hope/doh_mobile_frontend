export interface Emergency {
  id: number;
  hospital: string;
  bloodType: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: "Critical" | "Moderate" | "Low";
  timeLeft: string;
  description?: string;
  contactNumber?: string;
  address?: string;
  requirements?: string;
}

export interface DonationFormData {
  contactNumber: string;
  specialRequests: string;
}

export interface EmergencyStats {
  critical: number;
  moderate: number;
  low: number;
  total: number;
}
