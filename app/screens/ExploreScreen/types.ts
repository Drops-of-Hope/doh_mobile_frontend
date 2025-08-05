export interface Campaign {
  id: string;
  title: string;
  description: string;
  participants: number;
  location?: string;
  date?: string;
  time?: string;
}

export interface FilterCriteria {
  location: string;
  date: string;
}
