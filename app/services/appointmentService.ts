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

      // Handle different response formats
      let establishments: MedicalEstablishment[] = [];
      
      if (Array.isArray(response)) {
        establishments = response;
      } else if (response?.data && Array.isArray(response.data)) {
        establishments = response.data;
      } else if (response?.data?.establishments && Array.isArray(response.data.establishments)) {
        // Backend envelope: { success, data: { establishments: [...] } }
        establishments = response.data.establishments;
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

      return validEstablishments;
      
    } catch (error) {
      logger.error("Error fetching medical establishments:", error);
      throw error;
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

      // Handle different response formats
      let slots: AppointmentSlot[] = [];
      
      if (Array.isArray(response)) {
        slots = response;
      } else if (response?.data && Array.isArray(response.data)) {
        slots = response.data;
      } else if (response?.data?.slots && Array.isArray(response.data.slots)) {
        // Backend envelope: { success, data: { slots: [...] } }
        slots = response.data.slots;
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
      
      // Backend format: { success: true, data: [...] } or
      // { success: true, data: { appointments: [...] } }
      if (response?.success === true && response?.data) {
        if (Array.isArray(response.data)) {
          appointments = response.data;
        } else if (Array.isArray(response.data.appointments)) {
          appointments = response.data.appointments;
        } else {
          logger.warn("📋 Response has success=true but data is not an array:", response.data);
          return [];
        }
      } else if (Array.isArray(response)) {
        appointments = response;
      } else if (response?.data && Array.isArray(response.data)) {
        appointments = response.data;
      } else if (response?.appointments && Array.isArray(response.appointments)) {
        appointments = response.appointments;
      } else if (response?.success && response?.data === null) {
        // API returned success with null data (no appointments)
        return [];
      } else if (response === null || response === undefined) {
        // API returned null/undefined (no appointments)
        return [];
      } else {
        logger.warn("📋 Unexpected response format for user appointments:", response);
        logger.warn("📋 Keys in response:", Object.keys(response || {}));
        return [];
      }

      return appointments;
      
    } catch (error: any) {
      logger.error("❌ Error fetching user appointments:", error);
      logger.error("❌ Error type:", typeof error);
      logger.error("❌ Error message:", error?.message);
      logger.error("❌ Error status:", error?.status);
      logger.error("❌ Full error object:", JSON.stringify(error, null, 2));
      
      // For new users who don't have appointments yet, the backend 404s —
      // that's a legitimate empty state, not a failure.
      if (error.message?.includes("404") ||
          error.message?.includes("not found") ||
          error.status === 404) {
        return [];
      }

      // Any other error (network failure, 5xx, auth, etc.) is a real
      // failure — surface it so the caller can show an error instead of
      // silently rendering "no appointments".
      throw error;
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
