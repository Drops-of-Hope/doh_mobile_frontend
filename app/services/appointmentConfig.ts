// Production appointment configuration - no mock services allowed

export const APPOINTMENT_CONFIG = {
  // API Configuration
  API_TIMEOUT: 10000, // 10 seconds

  // Business Rules
  APPOINTMENT_RULES: {
    MAX_DAYS_AHEAD: 7, // Can book up to 7 days in advance
    MIN_DAYS_AHEAD: 1, // Must book at least 1 day ahead
    SLOTS_PER_ESTABLISHMENT: 12, // Number of slots per day per establishment
  },
};

// Production service only - no mock fallback
export const getAppointmentService = () => {
  return require("./appointmentService").appointmentService;
};
