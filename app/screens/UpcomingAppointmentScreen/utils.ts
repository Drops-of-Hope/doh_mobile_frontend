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

// Mock appointments removed - using real backend data only

export const filterAppointments = (appointments: Appointment[]) => {
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "upcoming" || apt.status === "confirmed",
  );

  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "cancelled",
  );

  return { upcomingAppointments, pastAppointments };
};
