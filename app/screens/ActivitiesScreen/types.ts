export interface DonationActivityDetails {
  bloodType?: string;
  volume?: number;
  hemoglobin?: number;
  bloodPressure?: string;
  weight?: number;
  notes?: string;
}

export interface DonationActivity {
  id: string;
  campaignTitle: string;
  campaignLocation: string;
  donationDate: string;
  type: "donation" | "checkup";
  status: "completed" | "pending" | "cancelled";
  createdAt?: string;
  details?: DonationActivityDetails;
}
