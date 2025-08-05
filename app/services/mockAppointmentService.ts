import {
  MedicalEstablishment,
  AppointmentSlot,
  Appointment,
  AppointmentBookingRequest,
} from "./appointmentService";

import { District, DISTRICT_TO_PROVINCE } from "../../constants/districts";

// Mock data for testing without backend
export const mockAppointmentService = {
  // Mock medical establishments data
  mockEstablishments: {
    [District.COLOMBO]: [
      {
        id: "me-001",
        name: "National Hospital of Sri Lanka",
        address: "Regent Street, Colombo 07",
        region: "Western",
        email: "info@nhsl.health.gov.lk",
        bloodCapacity: 500,
        isBloodBank: true,
      },
      {
        id: "me-002",
        name: "Colombo General Hospital",
        address: "Kinsey Road, Colombo 08",
        region: "Western",
        email: "info@cgh.health.gov.lk",
        bloodCapacity: 300,
        isBloodBank: true,
      },
      {
        id: "me-003",
        name: "Colombo South Teaching Hospital",
        address: "Kalubowila, Dehiwala",
        region: "Western",
        email: "info@csth.health.gov.lk",
        bloodCapacity: 200,
        isBloodBank: false,
      },
    ],
    [District.GAMPAHA]: [
      {
        id: "me-004",
        name: "Negombo General Hospital",
        address: "Colombo Road, Negombo",
        region: "Western",
        email: "info@ngh.health.gov.lk",
        bloodCapacity: 150,
        isBloodBank: true,
      },
      {
        id: "me-005",
        name: "Gampaha District General Hospital",
        address: "Gampaha",
        region: "Western",
        email: "info@gdgh.health.gov.lk",
        bloodCapacity: 120,
        isBloodBank: false,
      },
    ],
    [District.KANDY]: [
      {
        id: "me-006",
        name: "Teaching Hospital Kandy",
        address: "William Gopallawa Mawatha, Kandy",
        region: "Central",
        email: "info@thk.health.gov.lk",
        bloodCapacity: 250,
        isBloodBank: true,
      },
      {
        id: "me-007",
        name: "Peradeniya Teaching Hospital",
        address: "Peradeniya, Kandy",
        region: "Central",
        email: "info@pth.health.gov.lk",
        bloodCapacity: 180,
        isBloodBank: true,
      },
    ],
    [District.GALLE]: [
      {
        id: "me-008",
        name: "Teaching Hospital Karapitiya",
        address: "Karapitiya, Galle",
        region: "Southern",
        email: "info@thk.health.gov.lk",
        bloodCapacity: 200,
        isBloodBank: true,
      },
    ],
  } as Record<District, MedicalEstablishment[]>,

  // Mock appointment slots
  generateMockSlots(establishmentId: string, date: string): AppointmentSlot[] {
    const morningSlots = [
      { start: "09:00", end: "09:30", token: 1, available: true },
      { start: "09:30", end: "10:00", token: 2, available: true },
      {
        start: "10:00",
        end: "10:30",
        token: 3,
        available: Math.random() > 0.3,
      }, // 70% chance available
      { start: "10:30", end: "11:00", token: 4, available: true },
      {
        start: "11:00",
        end: "11:30",
        token: 5,
        available: Math.random() > 0.4,
      }, // 60% chance available
      { start: "11:30", end: "12:00", token: 6, available: true },
    ];

    const afternoonSlots = [
      { start: "14:00", end: "14:30", token: 7, available: true },
      {
        start: "14:30",
        end: "15:00",
        token: 8,
        available: Math.random() > 0.2,
      }, // 80% chance available
      { start: "15:00", end: "15:30", token: 9, available: true },
      {
        start: "15:30",
        end: "16:00",
        token: 10,
        available: Math.random() > 0.3,
      }, // 70% chance available
      { start: "16:00", end: "16:30", token: 11, available: true },
      { start: "16:30", end: "17:00", token: 12, available: true },
    ];

    const allSlots = [...morningSlots, ...afternoonSlots];

    return allSlots
      .filter((slot) => slot.available)
      .map((slot) => ({
        id: `${establishmentId}-${date}-${slot.token}`,
        startTime: slot.start,
        endTime: slot.end,
        tokenNumber: slot.token,
        isAvailable: true,
        medicalEstablishmentId: establishmentId,
      }));
  },

  // Get medical establishments by district (mock)
  async getMedicalEstablishmentsByDistrict(
    district: District,
  ): Promise<MedicalEstablishment[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return this.mockEstablishments[district] || [];
  },

  // Get available slots (mock)
  async getAvailableSlots(
    medicalEstablishmentId: string,
    date: string,
  ): Promise<AppointmentSlot[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return this.generateMockSlots(medicalEstablishmentId, date);
  },

  // Book appointment (mock)
  async bookAppointment(
    bookingRequest: AppointmentBookingRequest,
  ): Promise<Appointment> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional failure for testing
    if (Math.random() < 0.05) {
      // 5% chance of failure
      throw new Error("Slot no longer available");
    }

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      donorId: bookingRequest.donorId,
      bdfId: `bdf-${Date.now()}`,
      scheduled: "PENDING",
      appointmentDateTime: `${bookingRequest.appointmentDate}T${bookingRequest.appointmentSlotId.split("-").pop()}:00.000Z`,
    };

    return appointment;
  },

  // Get user appointments (mock)
  async getUserAppointments(userId: string): Promise<Appointment[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock appointments
    return [
      {
        id: "apt-001",
        donorId: userId,
        bdfId: "bdf-001",
        scheduled: "PENDING",
        appointmentDateTime: "2025-08-15T09:00:00.000Z",
      },
      {
        id: "apt-002",
        donorId: userId,
        bdfId: "bdf-002",
        scheduled: "COMPLETED",
        appointmentDateTime: "2025-07-20T14:00:00.000Z",
      },
    ];
  },

  // Cancel appointment (mock)
  async cancelAppointment(appointmentId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Mock cancellation - no actual implementation needed
  },

  // Reschedule appointment (mock)
  async rescheduleAppointment(
    appointmentId: string,
    newSlotId: string,
    newDate: string,
  ): Promise<Appointment> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: appointmentId,
      donorId: "user-123",
      bdfId: "bdf-updated",
      scheduled: "PENDING",
      appointmentDateTime: `${newDate}T${newSlotId}:00.000Z`,
    };
  },
};
