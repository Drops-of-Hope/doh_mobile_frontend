// Configuration for appointment services
// Change USE_MOCK_SERVICES to false when backend is ready

export const APPOINTMENT_CONFIG = {
  // Set to false when backend API is available
  USE_MOCK_SERVICES: false,

  // API Configuration
  API_TIMEOUT: 10000, // 10 seconds

  // Mock Service Configuration
  MOCK_API_DELAY: {
    ESTABLISHMENTS: 800, // ms
    SLOTS: 600, // ms
    BOOKING: 1000, // ms
  },

  // Error Simulation (for testing)
  MOCK_ERROR_RATES: {
    BOOKING_FAILURE: 0.05, // 5% chance of booking failure
    NETWORK_ERROR: 0.02, // 2% chance of network error
  },

  // Business Rules
  APPOINTMENT_RULES: {
    MAX_DAYS_AHEAD: 7, // Can book up to 7 days in advance
    MIN_DAYS_AHEAD: 1, // Must book at least 1 day ahead
    SLOTS_PER_ESTABLISHMENT: 12, // Number of slots per day per establishment
  },
};

// Helper function to get the appropriate service
export const getAppointmentService = () => {
  if (APPOINTMENT_CONFIG.USE_MOCK_SERVICES) {
    return require("./mockAppointmentService").mockAppointmentService;
  } else {
    return require("./appointmentService").appointmentService;
  }
};
