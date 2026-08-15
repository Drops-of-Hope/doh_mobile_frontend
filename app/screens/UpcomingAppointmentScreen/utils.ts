import { CheckCircle2, Clock, Check, XCircle, HelpCircle, LucideIcon } from "lucide-react-native";
import { Appointment } from "./types";

export type StatusTone = "success" | "crimson" | "ink" | "danger";

export const getStatusTone = (status: Appointment["status"]): StatusTone => {
  switch (status) {
    case "confirmed":
      return "success";
    case "upcoming":
      return "crimson";
    case "completed":
      return "ink";
    case "cancelled":
      return "danger";
    default:
      return "ink";
  }
};

export const getStatusIcon = (status: Appointment["status"]): LucideIcon => {
  switch (status) {
    case "confirmed":
      return CheckCircle2;
    case "upcoming":
      return Clock;
    case "completed":
      return Check;
    case "cancelled":
      return XCircle;
    default:
      return HelpCircle;
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
    return dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const filterAppointments = (appointments: Appointment[]) => {
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "upcoming" || apt.status === "confirmed"
  );

  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "cancelled"
  );

  return { upcomingAppointments, pastAppointments };
};
