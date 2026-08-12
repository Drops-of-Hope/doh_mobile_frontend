import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

import { logger } from "../utils/logger";
/**
 * Conservative client-side fallback for the minimum interval between whole
 * blood donations. The authoritative interval must come from the backend
 * eligibility endpoint; this is only used when no server-provided
 * eligibility or nextEligible date is available.
 */
const FALLBACK_DONATION_INTERVAL_DAYS = 120;

// Types for home screen data
export interface HomeScreenData {
  userStats: UserHomeStats;
  todaysAppointment?: TodaysAppointment;
  upcomingAppointments: Appointment[];
  recentActivities: Activity[];
  emergencies: Emergency[];
  featuredCampaigns: Campaign[];
  notifications: Notification[];
  donationEligibility: DonationEligibility;
}

export interface TodaysAppointment {
  id: string;
  appointmentDateTime?: string;
  appointmentDate?: string; // Backend might use this instead
  scheduled: string;
  medicalEstablishment: {
    id: string;
    name: string;
    address: string;
    district: string;
  };
  slot: {
    id: string;
    startTime: string;
    endTime: string;
  };
  location: string;
}

export interface UserHomeStats {
  id: string;
  userId: string;
  nextAppointmentDate?: string;
  nextAppointmentId?: string;
  totalDonations: number;
  totalPoints: number;
  donationStreak: number;
  lastDonationDate?: string;
  eligibleToDonate?: boolean;
  nextEligibleDate?: string;
  nextEligible?: string; // Alternative field name from User model
  lastUpdated: string;
}

export interface UserDonationData {
  totalDonations: number;
  lastDonationDate?: string;
  daysSinceLastDonation?: number;
  eligibleToDonate: boolean;
  nextEligibleDate?: string;
  bloodGroup: string;
}

export interface Appointment {
  id: string;
  donorId: string;
  appointmentDateTime: string;
  location?: string;
  notes?: string;
  scheduled: string;
  createdAt: string;
  medicalEstablishment?: {
    id: string;
    name: string;
    address: string;
    district: string;
  };
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  metadata?: any;
  createdAt: string;
  isRead: boolean;
}

export interface Emergency {
  id: string;
  title: string;
  description: string;
  bloodTypesNeeded: string[];
  quantityNeeded: Record<string, number>;
  urgencyLevel: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  status: "ACTIVE" | "FULFILLED" | "EXPIRED" | "CANCELLED";
  expiresAt: string;
  contactNumber: string;
  specialInstructions?: string;
  createdAt: string;
  hospital: {
    id: string;
    name: string;
    address: string;
    district: string;
  };
}

export interface Campaign {
  id: string;
  title: string;
  type: "FIXED" | "MOBILE";
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  expectedDonors: number;
  actualDonors: number;
  contactPersonName: string;
  contactPersonPhone: string;
  isApproved: boolean | "PENDING" | "ACCEPTED" | "CANCELLED";
  isActive: boolean;
  imageUrl?: string;
  requirements?: any;
  createdAt: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  medicalEstablishment: {
    id: string;
    name: string;
    address: string;
    district: string;
  };
  participationStatus?:
    | "NOT_JOINED"
    | "REGISTERED"
    | "CONFIRMED"
    | "ATTENDED"
    | "COMPLETED";
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
  isRead: boolean;
  createdAt: string;
}

export interface DonationEligibility {
  isEligible: boolean;
  nextEligibleDate?: string;
  reasons?: string[];
  recommendations?: string[];
  /**
   * True when eligibility could not be verified (API failure/offline).
   * Safety rule: never report a donor as eligible on failure — UI must show
   * an "unknown / check connection" state instead of a green light.
   */
  eligibilityUnknown?: boolean;
}

// Home service functions
export const homeService = {
  // Normalize varying backend shapes into UserHomeStats
  normalizeUserStats(raw: any): UserHomeStats {
    if (!raw || typeof raw !== "object") {
      return this.getDefaultUserStats();
    }

    // Detect if payload looks like compact /home/stats shape (id, name, email, totals, nextEligibleDate)
    const looksLikeCompactStats =
      "totalDonations" in raw || "totalPoints" in raw || "nextEligibleDate" in raw || "nextEligible" in raw;

    const nowIso = new Date().toISOString();

    // Prefer explicit fields when present, fallback to sensible defaults
    const userId = raw.userId || raw.user_id || raw.id || "unknown";
    const id = raw.id || raw.statsId || raw.stats_id || `home-stats-${userId}`;

    const eligibleProvided =
      Object.prototype.hasOwnProperty.call(raw, "eligibleToDonate") ||
      Object.prototype.hasOwnProperty.call(raw, "eligible");

    const normalized: UserHomeStats = {
      id: String(id),
      userId: String(userId),
      nextAppointmentDate: raw.nextAppointmentDate || raw.next_appointment_date || undefined,
      nextAppointmentId: raw.nextAppointmentId || raw.next_appointment_id || undefined,
      totalDonations: Number(raw.totalDonations ?? 0),
      totalPoints: Number(raw.totalPoints ?? 0),
      donationStreak: Number(raw.donationStreak ?? raw.streak ?? 0),
      lastDonationDate: raw.lastDonationDate || raw.last_donation_date || undefined,
      // eligibleToDonate may be absent in compact payload; we'll compute later in enhance step if missing
      eligibleToDonate: eligibleProvided
        ? Boolean(raw.eligibleToDonate ?? raw.eligible)
        : undefined,
      nextEligibleDate: raw.nextEligibleDate || raw.nextEligible || undefined,
      nextEligible: raw.nextEligible || undefined,
      lastUpdated: raw.lastUpdated || raw.updatedAt || nowIso,
    };

    // Mark whether eligible flag was provided by backend so enhancer can trust it
    (normalized as any).__eligibleProvided = eligibleProvided;

    return normalized;
  },
  // Get user donation statistics and data
  async getUserDonationData(): Promise<UserDonationData> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.USER_DONATION_HISTORY
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to fetch user donation data:", error);
      throw error;
    }
  },

  // Get user eligibility status
  async getUserEligibility(): Promise<DonationEligibility> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.USER_ELIGIBILITY);

      const eligibility = response.data || response;

      return eligibility;
    } catch (error) {
      logger.error("❌ Failed to fetch user eligibility:", error);

      // Safety-critical: never assume eligible when the API fails.
      return {
        isEligible: false,
        eligibilityUnknown: true,
        nextEligibleDate: undefined,
        reasons: ["Could not verify eligibility. Check your connection."],
        recommendations: [],
      };
    }
  },

  // Get user's upcoming appointment
  async getUpcomingAppointment(): Promise<Appointment | null> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.USER_APPOINTMENTS + "?status=upcoming&limit=1"
      );
      
      // Handle different response formats gracefully
      let appointments: Appointment[] = [];
      
      if (Array.isArray(response)) {
        appointments = response;
      } else if (response?.data && Array.isArray(response.data)) {
        appointments = response.data;
      } else if (response?.appointments && Array.isArray(response.appointments)) {
        appointments = response.appointments;
      }

      // Normalize date field name if backend uses appointmentDate
      appointments = appointments.map((a) => ({
        ...a,
        appointmentDateTime: (a as any).appointmentDateTime || (a as any).appointmentDate,
      }));
      
      return appointments.length > 0 ? appointments[0] : null;
    } catch (error) {
      logger.error("Failed to fetch upcoming appointment:", error);
      // Return null instead of throwing for graceful handling
      return null;
    }
  },

  // Get user profile with blood type
  async getUserProfile(): Promise<{
    bloodGroup: string;
    name: string;
    email: string;
  }> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      logger.error("Failed to fetch user profile:", error);
      throw error;
    }
  },

  // Get complete home screen data in one call
  async getHomeData(): Promise<HomeScreenData> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.HOME_DATA);

      // Ensure we have the data structure we expect
      let homeData = response.data || response;

      // Try to fetch authoritative stats from /home/stats and merge
      try {
        const authoritativeStats = await this.getUserStats();
        if (homeData.userStats) {
          // Merge: prefer non-null/defined values from authoritativeStats
          const base = this.normalizeUserStats(homeData.userStats);
          const merged: UserHomeStats = {
            ...base,
            ...authoritativeStats,
            // Prefer nextEligibleDate if provided by /home/stats
            nextEligibleDate: authoritativeStats.nextEligibleDate || base.nextEligibleDate,
            // Keep eligibleToDonate as computed/enhanced value from authoritativeStats
            eligibleToDonate: authoritativeStats.eligibleToDonate,
          };
          homeData.userStats = merged;
        } else {
          homeData.userStats = authoritativeStats;
        }
      } catch (mergeErr) {
        logger.warn("⚠️ Could not merge with /home/stats, using dashboard stats only:", mergeErr);
        // If userStats exists, ensure eligibility data is properly calculated
        if (homeData.userStats) {
          homeData.userStats = await this.enhanceUserStatsWithEligibility(
            this.normalizeUserStats(homeData.userStats)
          );
        }
      }

      return homeData;
    } catch (error) {
      logger.error("❌ Failed to fetch home data:", error);

      // If the API fails, try to get individual pieces of data
      try {
        const [userStats, upcomingAppointments, emergencies] = await Promise.allSettled([
          this.getUserStats(),
          this.getUpcomingAppointments(),
          this.getActiveEmergencies(),
        ]);

        return {
          userStats: userStats.status === 'fulfilled' ? userStats.value : this.getDefaultUserStats(),
          upcomingAppointments: upcomingAppointments.status === 'fulfilled' ? upcomingAppointments.value : [],
          recentActivities: [],
          emergencies: emergencies.status === 'fulfilled' ? emergencies.value : [],
          featuredCampaigns: [],
          notifications: [],
          donationEligibility: {
            isEligible: false,
            eligibilityUnknown: true,
            nextEligibleDate: undefined,
          },
        };
      } catch (fallbackError) {
        logger.error("❌ Fallback data fetch also failed:", fallbackError);
        throw error;
      }
    }
  },

  // Enhance user stats with proper eligibility calculation
  async enhanceUserStatsWithEligibility(userStats: UserHomeStats): Promise<UserHomeStats> {
    try {
      // Normalize nextEligibleDate from different possible field names
      const eligibleProvided = (userStats as any).__eligibleProvided === true;
      const hasEligibleFlag = eligibleProvided && typeof userStats.eligibleToDonate === "boolean";
      const normalizedNextEligible = userStats.nextEligibleDate || userStats.nextEligible || undefined;

      // If backend provided eligibleToDonate, trust it and only normalize nextEligibleDate
      if (hasEligibleFlag) {
        if (!userStats.nextEligibleDate && normalizedNextEligible) {
          userStats.nextEligibleDate = normalizedNextEligible;
        }
        return userStats;
      }

      // If no eligible flag but we have a nextEligible date, derive eligibility from it
      if (normalizedNextEligible) {
        const nextEligibleDateObj = new Date(normalizedNextEligible);
        if (!isNaN(nextEligibleDateObj.getTime())) {
          const now = new Date();
          const isCurrentlyEligible = now >= nextEligibleDateObj;
          userStats.eligibleToDonate = isCurrentlyEligible;
          userStats.nextEligibleDate = isCurrentlyEligible ? undefined : normalizedNextEligible;
          return userStats;
        }
      }

      // As a final fallback, calculate from last donation date (if available)
      if (userStats.lastDonationDate) {
        const lastDonation = new Date(userStats.lastDonationDate);
        if (!isNaN(lastDonation.getTime())) {
          const nextEligible = new Date(lastDonation);
          nextEligible.setDate(
            nextEligible.getDate() + FALLBACK_DONATION_INTERVAL_DAYS
          );
          const now = new Date();
          const isEligible = now >= nextEligible;
          userStats.eligibleToDonate = isEligible;
          userStats.nextEligibleDate = isEligible ? undefined : nextEligible.toISOString();
          return userStats;
        }
      }

      // No eligibility info at all: a donor with zero recorded donations is
      // genuinely eligible; anyone with donation history but missing dates is
      // treated as unknown (undefined) rather than assumed eligible.
      userStats.eligibleToDonate =
        userStats.totalDonations === 0 ? true : undefined;
      userStats.nextEligibleDate = undefined;
      return userStats;
    } catch (error) {
      logger.error("❌ Error enhancing user stats:", error);
      return userStats; // Return original stats if enhancement fails
    }
  },

  // Get default user stats for fallback
  getDefaultUserStats(): UserHomeStats {
    return {
      id: "default",
      userId: "unknown",
      totalDonations: 0,
      totalPoints: 0,
      donationStreak: 0,
      // Failure fallback: leave eligibility undefined ("unknown") rather than
      // claiming a donor is eligible when their real stats couldn't be loaded.
      eligibleToDonate: undefined,
      lastUpdated: new Date().toISOString(),
    };
  },

  // Get user stats only
  async getUserStats(): Promise<UserHomeStats> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.HOME_STATS);

      let userStats = this.normalizeUserStats(response.data || response);

      // Enhance with eligibility calculation
      userStats = await this.enhanceUserStatsWithEligibility(userStats);

      return userStats;
    } catch (error) {
      logger.error("❌ Failed to fetch user stats:", error);

      // Try alternative endpoint
      try {
        const response = await apiRequestWithAuth(API_ENDPOINTS.USER_STATS);
        let userStats = this.normalizeUserStats(response.data || response);
        userStats = await this.enhanceUserStatsWithEligibility(userStats);
        return userStats;
      } catch (altError) {
        logger.error("❌ Alternative endpoint also failed:", altError);
        throw error;
      }
    }
  },

  // Get upcoming appointments
  async getUpcomingAppointments(): Promise<Appointment[]> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.UPCOMING_APPOINTMENTS
      );
      
      // Handle different response formats gracefully
      let appointments: Appointment[] = [];
      
      if (Array.isArray(response)) {
        appointments = response;
      } else if (response?.data && Array.isArray(response.data)) {
        appointments = response.data;
      } else if (response?.appointments && Array.isArray(response.appointments)) {
        appointments = response.appointments;
      }
      
      // Normalize date field name if backend uses appointmentDate
      appointments = appointments.map((a) => ({
        ...a,
        appointmentDateTime: (a as any).appointmentDateTime || (a as any).appointmentDate,
      }));

      return appointments;
    } catch (error) {
      logger.error("Failed to fetch upcoming appointments:", error);
      // Return empty array instead of throwing for graceful handling
      return [];
    }
  },

  // Get recent activities
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_ACTIVITIES}?limit=${limit}&recent=true`
      );
      return response.data.activities;
    } catch (error) {
      logger.error("Failed to fetch recent activities:", error);
      throw error;
    }
  },

  // Get active emergencies
  async getActiveEmergencies(): Promise<Emergency[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.EMERGENCIES}?status=ACTIVE&limit=5`
      );
      return response.data.emergencies;
    } catch (error) {
      logger.error("Failed to fetch active emergencies:", error);
      throw error;
    }
  },

  // Get featured campaigns
  async getFeaturedCampaigns(): Promise<Campaign[]> {
    try {
      const primaryUrl = `${API_ENDPOINTS.UPCOMING_CAMPAIGNS}?featured=true&limit=5`;
      let response = await apiRequestWithAuth(primaryUrl);

      let data = response?.data?.campaigns || response?.campaigns || response?.data || response;
      if (Array.isArray(data)) return data as Campaign[];

      // Fallback 1: general campaigns with filters
      const fb1 = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGNS}?status=upcoming&featured=true&limit=5&sortBy=startTime&sortOrder=asc`
      );
      data = fb1?.data?.campaigns || fb1?.campaigns || fb1?.data || fb1;
      if (Array.isArray(data)) return data as Campaign[];

      // Fallback 2: bare upcoming, no query
      const fb2 = await apiRequestWithAuth(API_ENDPOINTS.UPCOMING_CAMPAIGNS);
      data = fb2?.data?.campaigns || fb2?.campaigns || fb2?.data || fb2;
      if (Array.isArray(data)) return data as Campaign[];

      // Fallback 3: fetch all and filter client-side
      const all = await apiRequestWithAuth(API_ENDPOINTS.CAMPAIGNS);
      const allData = all?.data?.campaigns || all?.campaigns || all?.data || all;
      if (Array.isArray(allData)) {
        const now = Date.now();
        const filtered = (allData as any[])
          .filter((c) => {
            const start = new Date(c.startTime || c.startDate || c.start_time).getTime();
            const active = c.isActive !== undefined ? !!c.isActive : true;
            const approved = typeof c.isApproved === "boolean"
              ? c.isApproved
              : typeof c.isApproved === "string"
              ? c.isApproved === "ACCEPTED"
              : typeof c.approvalStatus === "string"
              ? c.approvalStatus === "ACCEPTED"
              : true;
            return Number.isFinite(start) && start >= now && active && approved;
          })
          .sort((a, b) => {
            const sa = new Date(a.startTime || a.startDate || a.start_time).getTime();
            const sb = new Date(b.startTime || b.startDate || b.start_time).getTime();
            return sa - sb;
          })
          .slice(0, 5);
        return filtered as Campaign[];
      }

      throw new Error("Unexpected response format for featured campaigns");
    } catch (error) {
      logger.error("Failed to fetch featured campaigns:", error);
      throw error;
    }
  },

  // Get user notifications
  async getUserNotifications(limit: number = 10): Promise<Notification[]> {
    try {
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.USER_NOTIFICATIONS}?limit=${limit}`
      );
      return response.data.notifications;
    } catch (error) {
      logger.error("Failed to fetch user notifications:", error);
      throw error;
    }
  },

  // Calculate days since last donation
  calculateDaysSinceLastDonation(lastDonationDate: string): number {
    const lastDate = new Date(lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  // Format appointment for display
  formatAppointmentForDisplay(appointment: Appointment): {
    id: string;
    date: string;
    time: string;
    location: string;
    hospital: string;
    status: string;
  } {
    const appointmentDate = new Date(appointment.appointmentDateTime);
    return {
      id: appointment.id,
      date: appointmentDate.toLocaleDateString(),
      time: appointmentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location:
        appointment.medicalEstablishment?.name ||
        appointment.location ||
        "Unknown Location",
      hospital: appointment.medicalEstablishment?.name || "Unknown Hospital",
      status: appointment.scheduled,
    };
  },
};
