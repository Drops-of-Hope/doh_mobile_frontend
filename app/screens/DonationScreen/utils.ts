import { Appointment, UserProfile } from "./types";
import { appointmentService } from "../../services/appointmentService";
import type { Appointment as ServiceAppointment, MedicalEstablishment } from "../../services/appointmentService";

// Transform service appointment to screen appointment format
const transformAppointmentForDisplay = (
  serviceAppointment: ServiceAppointment
): Appointment => {
  console.log("\n🔄 ============ TRANSFORMATION START ============");
  console.log("🔄 Input serviceAppointment:", JSON.stringify(serviceAppointment, null, 2));
  
  const appointmentDate = new Date(serviceAppointment.appointmentDate);
  
  // Extract hospital name and location from medicalEstablishment
  const hasEstablishment = !!serviceAppointment.medicalEstablishment;
  const establishmentData = serviceAppointment.medicalEstablishment;
  
  console.log("🔄 Has medicalEstablishment:", hasEstablishment);
  console.log("🔄 Establishment data:", establishmentData);
  
  const hospitalName = establishmentData?.name || "Unknown Hospital";
  const location = establishmentData?.address || 
                   establishmentData?.district ||
                   "Location TBD";
  
  console.log("🔄 Extracted values:");
  console.log("   - Hospital Name:", hospitalName);
  console.log("   - Location:", location);
  console.log("   - Raw name value:", establishmentData?.name);
  console.log("   - Raw address value:", establishmentData?.address);
  console.log("   - Raw district value:", establishmentData?.district);
  
  const transformed: Appointment = {
    id: serviceAppointment.id,
    hospital: hospitalName,
    date: appointmentDate.toISOString().split('T')[0], // YYYY-MM-DD format
    time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: location,
    status: serviceAppointment.scheduled === "PENDING" 
      ? "upcoming" 
      : serviceAppointment.scheduled === "COMPLETED" 
        ? "completed" 
        : "cancelled"
  };
  
  console.log("🔄 Transformed appointment:", transformed);
  console.log("🔄 ============ TRANSFORMATION END ============\n");
  
  return transformed;
};

// Get user's appointment history (last 5) and upcoming appointments
export const getUserAppointments = async (userId: string): Promise<{
  upcoming: Appointment[];
  history: Appointment[];
}> => {
  try {
    console.log("🔍 Getting user appointments for userId:", userId);
    const serviceAppointments = await appointmentService.getUserAppointments(userId);
    console.log("📦 Received service appointments:", serviceAppointments.length);
    
    // Sort appointments by date (newest first)
    const sortedAppointments = serviceAppointments.sort((a, b) => 
      new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    );
    
    const now = new Date();
    
    // Separate upcoming and completed appointments
    const upcomingAppointments = sortedAppointments
      .filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= now && apt.scheduled === "PENDING";
      })
      .map(apt => transformAppointmentForDisplay(apt));
    
    console.log("📅 Upcoming appointments transformed:", upcomingAppointments.length);
    
    // Get last 5 completed appointments
    const historyAppointments = sortedAppointments
      .filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate < now || apt.scheduled === "COMPLETED" || apt.scheduled === "CANCELLED";
      })
      .slice(0, 5) // Last 5 appointments
      .map(apt => transformAppointmentForDisplay(apt));
    
    console.log("📜 History appointments transformed:", historyAppointments.length);
    
    return {
      upcoming: upcomingAppointments,
      history: historyAppointments
    };
  } catch (error) {
    console.error("❌ Error fetching user appointments:", error);
    // Return empty arrays on error
    return {
      upcoming: [],
      history: []
    };
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
