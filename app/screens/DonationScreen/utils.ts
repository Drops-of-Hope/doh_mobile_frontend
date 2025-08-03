import { Appointment, UserProfile } from "./types";

// Mock appointments data
export const getMockAppointments = (): Appointment[] => [
  {
    id: "1",
    hospital: "City General Hospital",
    date: "2024-01-15",
    time: "10:00 AM",
    location: "Blood Bank Unit, 3rd Floor",
    status: "upcoming",
  },
  {
    id: "2",
    hospital: "University Medical Center",
    date: "2023-12-20",
    time: "2:00 PM",
    location: "Donation Center",
    status: "completed",
  },
  {
    id: "3",
    hospital: "District Hospital",
    date: "2023-11-10",
    time: "9:30 AM",
    location: "Mobile Unit - Parking Lot",
    status: "completed",
  },
];

// Mock user profile
export const getMockUserProfile = (): UserProfile => ({
  id: "12345",
  name: "John Doe",
  email: "john.doe@example.com",
  bloodType: "O+",
  lastDonationDate: "2023-12-20",
  totalDonations: 8,
  eligibleForDonation: true,
});

// Generate QR code data
export const generateQRData = (userProfile: UserProfile | null): string => {
  if (!userProfile) return "";

  const qrData = {
    id: userProfile.id,
    name: userProfile.name,
    bloodType: userProfile.bloodType,
    eligibilityStatus: userProfile.eligibleForDonation
      ? "eligible"
      : "not_eligible",
    lastDonation: userProfile.lastDonationDate,
    totalDonations: userProfile.totalDonations,
    timestamp: new Date().toISOString(),
  };

  return JSON.stringify(qrData);
};

// Format date for display
export const formatAppointmentDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Get status color
export const getStatusColor = (status: Appointment["status"]): string => {
  switch (status) {
    case "upcoming":
      return "#10B981";
    case "completed":
      return "#6B7280";
    case "cancelled":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

// Get status badge background
export const getStatusBadgeBackground = (
  status: Appointment["status"],
): string => {
  switch (status) {
    case "upcoming":
      return "#10B981" + "20";
    case "completed":
      return "#6B7280" + "20";
    case "cancelled":
      return "#EF4444" + "20";
    default:
      return "#6B7280" + "20";
  }
};
