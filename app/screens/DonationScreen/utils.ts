import { Appointment, UserProfile } from "./types";
import { appointmentService } from "../../services/appointmentService";
import type { Appointment as ServiceAppointment, MedicalEstablishment } from "../../services/appointmentService";

import { daysUntil } from "../../utils/appointmentUrgency";
import { logger } from "../../utils/logger";
// Transform service appointment to screen appointment format
const transformAppointmentForDisplay = (
  serviceAppointment: ServiceAppointment
): Appointment => {
  const appointmentDate = new Date(serviceAppointment.appointmentDate);

  // Extract hospital name and location from medicalEstablishment
  const establishmentData = serviceAppointment.medicalEstablishment;

  const hospitalName = establishmentData?.name || "Unknown Hospital";
  const location = establishmentData?.address || 
                   establishmentData?.district ||
                   "Location TBD";
  
  // Only the slot carries a real time. appointmentDate is stored at UTC
  // midnight, so formatting its clock component yields a bogus "05:30" in
  // UTC+5:30 — leave it blank rather than show a time the donor might trust.
  const slotData = serviceAppointment.slot;
  const timeDisplay =
    slotData?.startTime && slotData?.endTime ? `${slotData.startTime} - ${slotData.endTime}` : "";

  const transformed: Appointment = {
    id: serviceAppointment.id,
    hospital: hospitalName,
    date: appointmentDate.toISOString().split('T')[0], // YYYY-MM-DD format
    time: timeDisplay,
    location: location,
    status: serviceAppointment.scheduled === "PENDING" 
      ? "upcoming" 
      : serviceAppointment.scheduled === "COMPLETED" 
        ? "completed" 
        : "cancelled"
  };
  
  return transformed;
};

// Get user's appointment history (last 5) and upcoming appointments
export const getUserAppointments = async (userId: string): Promise<{
  upcoming: Appointment[];
  history: Appointment[];
}> => {
  try {
    const serviceAppointments = await appointmentService.getUserAppointments(userId);

    // Sort appointments by date (newest first)
    const sortedAppointments = serviceAppointments.sort((a, b) => 
      new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    );
    
    // Compare by calendar day, not by instant: appointmentDate is stored at UTC
    // midnight, which is already "in the past" by mid-morning local time, so a
    // raw `aptDate >= now` check filed today's appointment under history.
    const isUpcoming = (apt: ServiceAppointment) =>
      daysUntil(apt.appointmentDate) >= 0 && apt.scheduled === "PENDING";

    const upcomingAppointments = sortedAppointments
      .filter(isUpcoming)
      .map(apt => transformAppointmentForDisplay(apt));

    // Get last 5 past/closed appointments
    const historyAppointments = sortedAppointments
      .filter(apt => !isUpcoming(apt))
      .slice(0, 5) // Last 5 appointments
      .map(apt => transformAppointmentForDisplay(apt));

    return {
      upcoming: upcomingAppointments,
      history: historyAppointments
    };
  } catch (error) {
    logger.error("❌ Error fetching user appointments:", error);
    // Let the caller distinguish "no appointments yet" from a real failure
    // (appointmentService already resolves 404/not-found to an empty list).
    throw error;
  }
};

// authenticated user from AuthContext. If you need a test user while
// developing, use the app's `TestingPanel` or inject a test auth state.

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
