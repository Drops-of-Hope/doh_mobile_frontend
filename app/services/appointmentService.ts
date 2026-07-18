import { apiRequestWithAuth, API_ENDPOINTS } from "./api";
import { District, DISTRICT_TO_PROVINCE } from "../../constants/districts";

import { logger } from "../utils/logger";
// Medical Establishment interface
export interface MedicalEstablishment {
  id: string;
  name: string;
  address: string;
  region: string;
  email: string;
  bloodCapacity: number;
  isBloodBank: boolean;
}

// Appointment Slot interface
export interface AppointmentSlot {
  id: string;
  startTime: string;
  endTime: string;
  tokenNumber?: number;
  donorsPerSlot?: number; // Alternative field name from API
  isAvailable: boolean;
  medicalEstablishmentId: string;
}

// Appointment interface - comprehensive with all needed details
export interface Appointment {
  id: string;
  donorId: string;
  bdfId?: string;
  scheduled: "CANCELLED" | "COMPLETED" | "PENDING";
  appointmentDate: Date;
  slotId: string;
  medicalEstablishment?: {
    id: string;
    name: string;
    address: string;
    district: string;
  };
  slot?: {
    id: string;
    startTime: string;
    endTime: string;
  };
}

// Appointment booking request interface
export interface AppointmentBookingRequest {
  donorId: string;
  slotId: string;
  appointmentDate: string;
  medicalEstablishmentId: string;
}

// Appointment service
export const appointmentService = {
  // Get medical establishments by district
  getMedicalEstablishmentsByDistrict: async (
    district: District
  ): Promise<MedicalEstablishment[]> => {
    try {
      logger.log(`Fetching medical establishments for district: ${district}`);
      
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.MEDICAL_ESTABLISHMENTS}?district=${district}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      
      logger.log("Medical establishments response:", response);
      
      // Handle different response formats
      let establishments: MedicalEstablishment[] = [];
      
      if (Array.isArray(response)) {
        establishments = response;
      } else if (response?.data && Array.isArray(response.data)) {
        establishments = response.data;
      } else if (response?.establishments && Array.isArray(response.establishments)) {
        establishments = response.establishments;
      } else {
        logger.warn("Unexpected response format for medical establishments:", response);
        return [];
      }
      
      // Validate establishment format
      const validEstablishments = establishments.filter(est => 
        est && typeof est === 'object' && est.id && est.name
      );
      
      logger.log(`Validated ${validEstablishments.length} medical establishments`);
      return validEstablishments;
      
    } catch (error) {
      logger.error("Error fetching medical establishments:", error);
      // Don't throw here, let the caller handle the empty array
      return [];
    }
  },

  // Get available appointment slots for a medical establishment on a specific date
  getAvailableSlots: async (
    medicalEstablishmentId: string,
    selectedDate?: string
  ): Promise<AppointmentSlot[]> => {
    try {
      let url = `${API_ENDPOINTS.APPOINTMENT_SLOTS}/getSlots?establishmentId=${medicalEstablishmentId}`;
      
      // Add date parameter if provided
      if (selectedDate) {
        url += `&date=${selectedDate}`;
      }
      
      const response = await apiRequestWithAuth(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      logger.log("AppointmentSlot response:", response);
      
      // Handle different response formats
      let slots: AppointmentSlot[] = [];
      
      if (Array.isArray(response)) {
        slots = response;
      } else if (response?.data && Array.isArray(response.data)) {
        slots = response.data;
      } else if (response?.slots && Array.isArray(response.slots)) {
        slots = response.slots;
      }
      
      // Filter only available slots and ensure they have required fields
      const availableSlots = slots.filter(slot => 
        slot.isAvailable && 
        slot.startTime && 
        slot.endTime && 
        slot.medicalEstablishmentId
      ).map(slot => ({
        ...slot,
        // Ensure tokenNumber exists, use donorsPerSlot as fallback
        tokenNumber: slot.tokenNumber || slot.donorsPerSlot || 0,
      }));
      
      logger.log("✅ Processed available slots:", availableSlots);
      return availableSlots;
    } catch (error) {
      logger.error("❌ Error fetching appointment slots:", error);
      throw error;
    }
  },

  // Create an appointment
  createAppointment: async (
    bookingRequest: AppointmentBookingRequest
  ): Promise<Appointment> => {
    try {
      // fail fast if medicalEstablishmentId is not provided
      if (!bookingRequest.medicalEstablishmentId) {
        logger.warn(
          "Booking request missing medicalEstablishmentId:",
          bookingRequest
        );
        throw new Error("medicalEstablishmentId is required in bookingRequest");
      }

      logger.log("Booking request:", bookingRequest);
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CREATE_APPOINTMENT}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingRequest),
        }
      );

      return response as Appointment;
    } catch (error) {
      logger.error("Error booking appointment:", error);
      throw error;
    }
  },

  // Get user's appointments
  getUserAppointments: async (userId: string): Promise<Appointment[]> => {
    try {
      logger.log("🔍 Fetching appointments for user:", userId);
      logger.log("🌐 API Endpoint:", API_ENDPOINTS.USER_APPOINTMENTS);
      
      // Try without userId first (backend might get user from auth token)
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_APPOINTMENTS}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      
      // Handle different response formats and empty data gracefully
      let appointments: Appointment[] = [];
      
      // Backend format: { success: true, data: [...] }
      if (response?.success === true && response?.data) {
        if (Array.isArray(response.data)) {
          appointments = response.data;
          logger.log("📋 Using response.data array (success format)");
        } else {
          logger.warn("📋 Response has success=true but data is not an array:", response.data);
          return [];
        }
      } else if (Array.isArray(response)) {
        appointments = response;
        logger.log("📋 Using direct array response");
      } else if (response?.data && Array.isArray(response.data)) {
        appointments = response.data;
        logger.log("📋 Using response.data array");
      } else if (response?.appointments && Array.isArray(response.appointments)) {
        appointments = response.appointments;
        logger.log("📋 Using response.appointments array");
      } else if (response?.success && response?.data === null) {
        // API returned success with null data (no appointments)
        logger.log("📋 User has no appointments yet (success with null data)");
        return [];
      } else if (response === null || response === undefined) {
        // API returned null/undefined (no appointments)
        logger.log("📋 User has no appointments yet (null/undefined response)");
        return [];
      } else {
        logger.warn("📋 Unexpected response format for user appointments:", response);
        logger.warn("📋 Keys in response:", Object.keys(response || {}));
        return [];
      }
      
      logger.log(`✅ Found ${appointments.length} appointments for user`);
      
      // Log each appointment's medicalEstablishment data in detail
      appointments.forEach((apt, index) => {
        logger.log(`\n📋 ============ Appointment ${index + 1} ============`);
        logger.log(`   ID: ${apt.id}`);
        logger.log(`   Appointment Date: ${apt.appointmentDate}`);
        logger.log(`   Scheduled Status: ${apt.scheduled}`);
        logger.log(`   Has medicalEstablishment: ${!!apt.medicalEstablishment}`);
        
        if (apt.medicalEstablishment) {
          logger.log(`   Medical Establishment Details:`);
          logger.log(`     - ID: ${apt.medicalEstablishment.id}`);
          logger.log(`     - Name: ${apt.medicalEstablishment.name || 'MISSING'}`);
          logger.log(`     - Address: ${apt.medicalEstablishment.address || 'MISSING'}`);
          logger.log(`     - District: ${apt.medicalEstablishment.district || 'N/A'}`);
        } else {
          logger.warn(`   ⚠️ NO medicalEstablishment data for appointment ${apt.id}`);
        }
        
        if (apt.slot) {
          logger.log(`   Slot Details:`);
          logger.log(`     - ID: ${apt.slot.id}`);
          logger.log(`     - Start: ${apt.slot.startTime}`);
          logger.log(`     - End: ${apt.slot.endTime}`);
        }
        logger.log(`   ==========================================\n`);
      });
      
      return appointments;
      
    } catch (error: any) {
      logger.error("❌ Error fetching user appointments:", error);
      logger.error("❌ Error type:", typeof error);
      logger.error("❌ Error message:", error?.message);
      logger.error("❌ Error status:", error?.status);
      logger.error("❌ Full error object:", JSON.stringify(error, null, 2));
      
      // For new users who don't have appointments yet, don't throw an error
      if (error.message?.includes("404") || 
          error.message?.includes("not found") ||
          error.message?.includes("Network request failed") ||
          error.status === 404) {
        logger.log("ℹ️ User likely has no appointments yet, returning empty array");
        return [];
      }
      
      // For other errors, still return empty array but log it
      logger.warn("⚠️ Returning empty appointments array due to error:", error.message);
      return [];
    }
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    try {
      await apiRequestWithAuth(
        `${API_ENDPOINTS.APPOINTMENTS}/${appointmentId}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      logger.error("Error cancelling appointment:", error);
      throw error;
    }
  },

  // Reschedule an appointment
  rescheduleAppointment: async (
    appointmentId: string,
    newSlotId: string,
    newDate: string
  ): Promise<Appointment> => {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.APPOINTMENTS}/${appointmentId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            slotId: newSlotId,
            appointmentDate: newDate,
          }),
        }
      );

      return response;
    } catch (error) {
      logger.error("Error rescheduling appointment:", error);
      throw error;
    }
  },
};
