export interface Campaign {
  id: string;
  title: string;
  description: string;
  participants: number;
  location?: string;
  date?: string;
  time?: string;
  isRegistered?: boolean;
  participationId?: string;
  participationStatus?: "REGISTERED" | "CONFIRMED" | "ATTENDED" | "COMPLETED" | "CANCELLED";
}

export interface FilterCriteria {
  location: string;
  date: string;
}
