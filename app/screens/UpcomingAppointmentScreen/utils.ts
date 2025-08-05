import { Appointment } from "./types";

export const getStatusColor = (status: Appointment["status"]): string => {
  switch (status) {
    case "confirmed":
      return "#10B981";
    case "upcoming":
      return "#DC2626";
    case "completed":
      return "#6B7280";
    case "cancelled":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export const getStatusIcon = (status: Appointment["status"]): string => {
  switch (status) {
    case "confirmed":
      return "checkmark-circle";
    case "upcoming":
      return "time";
    case "completed":
      return "checkmark";
    case "cancelled":
      return "close-circle";
    default:
      return "help-circle";
  }
};

export const getTypeDisplay = (type: Appointment["type"]): string => {
  switch (type) {
    case "blood_donation":
      return "Whole Blood Donation";
    case "platelet_donation":
      return "Platelet Donation";
    case "plasma_donation":
      return "Plasma Donation";
    default:
      return "Blood Donation";
  }
};

export const formatAppointmentDate = (date: string, isPast = false): string => {
  const dateObj = new Date(date);

  if (isPast) {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getMockAppointments = (): Appointment[] => [
  {
    id: "1",
    hospital: "City General Hospital",
    date: "2024-01-15",
    time: "10:00 AM",
    location: "Blood Bank Unit, 3rd Floor",
    confirmationId: "APT-2024-001",
    status: "confirmed",
    type: "blood_donation",
    notes: "Please arrive 15 minutes early. Bring a valid ID.",
  },
  {
    id: "2",
    hospital: "University Medical Center",
    date: "2024-02-20",
    time: "2:00 PM",
    location: "Donation Center, Building A",
    confirmationId: "APT-2024-025",
    status: "upcoming",
    type: "platelet_donation",
    notes: "Platelet donation session. Duration: 2-3 hours.",
  },
];

export const filterAppointments = (appointments: Appointment[]) => {
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "upcoming" || apt.status === "confirmed",
  );

  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "cancelled",
  );

  return { upcomingAppointments, pastAppointments };
};
