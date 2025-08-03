import { apiRequest, API_ENDPOINTS } from "./api";
import { District, DISTRICT_TO_PROVINCE } from "../../constants/districts";

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
  tokenNumber: number;
  isAvailable: boolean;
  medicalEstablishmentId: string;
}

// Appointment interface
export interface Appointment {
  id: string;
  donorId: string;
  bdfId: string;
  scheduled: "CANCELLED" | "COMPLETED" | "PENDING";
  appointmentDateTime: string;
  medicalEstablishment?: MedicalEstablishment;
  appointmentSlot?: AppointmentSlot;
}

// Appointment booking request interface
export interface AppointmentBookingRequest {
  district: District;
  medicalEstablishmentId: string;
  appointmentDate: string;
  appointmentSlotId: string;
  donorId: string;
}

// Appointment service
export const appointmentService = {
  // Get medical establishments by district
  getMedicalEstablishmentsByDistrict: async (
    district: District,
  ): Promise<MedicalEstablishment[]> => {
    try {
      const response = await apiRequest(
        `${API_ENDPOINTS.MEDICAL_ESTABLISHMENTS}?district=${district}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Medical establishments response:", response);
      return response as MedicalEstablishment[];
    } catch (error) {
      console.error("Error fetching medical establishments:", error);
      throw error;
    }
  },

  // Get available appointment slots for a medical establishment on a specific date
  getAvailableSlots: async (
    medicalEstablishmentId: string
  ): Promise<AppointmentSlot[]> => {
    try {
      const response = await apiRequest(
        `${API_ENDPOINTS.APPOINTMENT_SLOTS}/getSlots?establishmentId=${medicalEstablishmentId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      // Return only available slots
      console.log("AppointmentSlot response:", response);
      return response as AppointmentSlot[];
    } catch (error) {
      console.error("Error fetching appointment slots:", error);
      throw error;
    }
  },

  // Book an appointment
  bookAppointment: async (
    bookingRequest: AppointmentBookingRequest,
  ): Promise<Appointment> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.APPOINTMENTS, {
        method: "POST",
        body: JSON.stringify(bookingRequest),
      });

      // Mock response
      const mockAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        donorId: bookingRequest.donorId,
        bdfId: `bdf-${Date.now()}`,
        scheduled: "PENDING",
        appointmentDateTime: `${bookingRequest.appointmentDate}T${bookingRequest.appointmentSlotId}:00.000Z`,
      };

      return mockAppointment;
    } catch (error) {
      console.error("Error booking appointment:", error);
      throw error;
    }
  },

  // Get user's appointments
  getUserAppointments: async (userId: string): Promise<Appointment[]> => {
    try {
      const response = await apiRequest(
        `${API_ENDPOINTS.APPOINTMENTS}/user/${userId}`,
        {
          method: "GET",
        },
      );

      // Mock user appointments
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          donorId: userId,
          bdfId: "bdf-001",
          scheduled: "PENDING",
          appointmentDateTime: "2025-08-15T09:00:00.000Z",
        },
      ];

      return mockAppointments;
    } catch (error) {
      console.error("Error fetching user appointments:", error);
      throw error;
    }
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    try {
      await apiRequest(`${API_ENDPOINTS.APPOINTMENTS}/${appointmentId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      throw error;
    }
  },

  // Reschedule an appointment
  rescheduleAppointment: async (
    appointmentId: string,
    newSlotId: string,
    newDate: string,
  ): Promise<Appointment> => {
    try {
      const response = await apiRequest(
        `${API_ENDPOINTS.APPOINTMENTS}/${appointmentId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            appointmentSlotId: newSlotId,
            appointmentDate: newDate,
          }),
        },
      );

      return response;
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      throw error;
    }
  },
};
