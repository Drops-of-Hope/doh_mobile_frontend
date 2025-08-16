import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

// User profile interface aligned with Prisma `User` model
export interface UserProfile {
  id: string;
  nic?: string;
  email: string;
  name: string;
  bloodGroup?: string; // Enum values like A_POSITIVE, O_NEGATIVE etc.
  profileImageUrl?: string | null;
  totalDonations?: number;
  totalPoints?: number;
  nextEligible?: string | null; // ISO datetime
}

// Donation form data interface aligned with government blood donation form
export interface DonationFormData {
  // Step 1: Previous donation history
  hasDonatedBefore?: boolean;
  donationCount?: number;
  lastDonationDate?: string;
  anyDifficulty?: boolean;
  difficultyDetails?: string;
  medicalAdvice?: boolean;
  readInformationLeaflet?: boolean;

  // Step 2: Current health status
  feelingWell?: boolean;
  medicalConditions?: {
    heartDisease?: boolean;
    strokes?: boolean;
    kidneyDiseases?: boolean;
    diabetes?: boolean;
    fits?: boolean;
    liverDiseases?: boolean;
    asthmaLungDisease?: boolean;
    bloodDisorders?: boolean;
    cancer?: boolean;
  };
  takingMedicines?: boolean;
  anySurgery?: boolean;
  workingLater?: boolean;
  pregnant?: boolean;
  breastFeeding?: boolean;
  recentChildbirth?: boolean;

  // Step 3: Past illnesses
  haveHepatitis?: boolean;
  haveTB?: boolean;
  hadTyphoid?: boolean;

  // Step 4: Past 12 months activities
  hadVaccination?: boolean;
  tattoos?: boolean;
  haveImprisonment?: boolean;
  travelledAbroad?: boolean;
  partnerTravelledAbroad?: boolean;
  receivedBlood?: boolean;
  partnerReceivedBlood?: boolean;
  hadMalaria?: boolean;

  // Step 5: Recent illnesses
  hasDengue?: boolean;
  hadLongFever?: boolean;
  hadChickenPox?: boolean;
  hadMeasles?: boolean;
  hadMumps?: boolean;
  hadRubella?: boolean;
  hadDiarrhoea?: boolean;
  hadtoothExtraction?: boolean;
  bookAspirin?: boolean;
  tookAntibiotics?: boolean;
  tookOtherMedicine?: boolean;

  // Step 6: High-risk categories and declaration
  knowledgeAgent?: boolean;
  highRisk?: boolean;
  feverLymphNode?: boolean;
  hadWeightLoss?: boolean;
  Acknowledgement?: boolean; // Mandatory donor declaration

  // Optional more detailed fields that map to schema
  dateTime?: string; // ISO datetime
  donorId?: string;
  userId?: string;
  appointmentId?: string;
  anyDiseases?: any; // Legacy field for backward compatibility
}

// Donation service functions
export const donationService = {
  // Submit donation form (expects payload matching BloodDonationForm fields)
  submitDonationForm: async (formData: DonationFormData): Promise<any> => {
    // Transform front-end form shape to match BloodDonationForm schema
    const anyDiseasesJson: Record<string, any> = {};

    // Collect medical conditions into anyDiseases JSON
    if (formData.medicalConditions) {
      Object.assign(anyDiseasesJson, formData.medicalConditions);
    }

    // Collect unknown/supplementary boolean fields into anyDiseases JSON
    if (typeof formData.knowledgeAgent !== "undefined") {
      anyDiseasesJson.knowledgeAgent = !!formData.knowledgeAgent;
    }
    if (typeof formData.feverLymphNode !== "undefined") {
      anyDiseasesJson.feverLymphNode = !!formData.feverLymphNode;
    }

    const transformedPayload: any = {
      // schema fields
      dateTime: formData.dateTime || new Date().toISOString(),
      donorId: formData.donorId || formData.userId || undefined,
      hasDonatedBefore: formData.hasDonatedBefore,
      anyDifficulty: formData.anyDifficulty
        ? formData.difficultyDetails || "yes"
        : "no",
      medicalAdvice: formData.medicalAdvice,
      feelingWell: formData.feelingWell,
      anyDiseases: Object.keys(anyDiseasesJson).length
        ? anyDiseasesJson
        : formData.anyDiseases || {},
      takingMedicines: formData.takingMedicines,
      anySurgery: formData.anySurgery,
      workingLater: formData.workingLater,
      pregnant:
        formData.pregnant ||
        formData.breastFeeding ||
        formData.recentChildbirth,
      haveHepatitis: formData.haveHepatitis,
      haveTB: formData.haveTB,
      hadVaccination: formData.hadVaccination,
      tattoos: formData.tattoos,
      haveImprisonment: formData.haveImprisonment,
      travelledAbroad:
        formData.travelledAbroad || formData.partnerTravelledAbroad,
      receivedBlood: formData.receivedBlood || formData.partnerReceivedBlood,
      chemotherapy: false, // Not in new form structure
      hadMalaria: formData.hadMalaria,
      hasDengue: formData.hasDengue,
      hadLongFever: formData.hadLongFever,
      hadtoothExtraction: formData.hadtoothExtraction,
      bookAspirin: formData.bookAspirin,
      Acknowledgement: formData.Acknowledgement,
      highRisk: formData.highRisk,
      hadWeightLoss: formData.hadWeightLoss,
      userId: formData.userId,
    };

    // Ensure we include the userId so backend can associate the submission
    let userIdToSend = transformedPayload.userId;

    if (!userIdToSend) {
      try {
        const profile = await apiRequestWithAuth(API_ENDPOINTS.USER_PROFILE, {
          method: "GET",
        });

        if (profile && (profile.id || profile.sub)) {
          userIdToSend = profile.id || profile.sub;
          transformedPayload.userId = userIdToSend;
          transformedPayload.donorId = userIdToSend;
        }
      } catch (err) {
        // If fetching profile fails, log and continue; payload will be sent without userId
        console.warn(
          "donationService: could not fetch user profile to attach userId:",
          err
        );
      }
    }

    return apiRequestWithAuth(API_ENDPOINTS.DONATION_FORM, {
      method: "POST",
      body: JSON.stringify(transformedPayload),
    });
  },

  // Join campaign
  joinCampaign: async (campaignId: string): Promise<any> => {
    return apiRequestWithAuth(API_ENDPOINTS.JOIN_CAMPAIGN, {
      method: "POST",
      body: JSON.stringify({ campaignId }),
    });
  },

  // Get user profile for QR code and donation purposes
  getUserProfile: async (): Promise<UserProfile> => {
    return apiRequestWithAuth(API_ENDPOINTS.USER_PROFILE, {
      method: "GET",
    });
  },

  // Get campaigns
  getCampaigns: async (): Promise<any[]> => {
    return apiRequestWithAuth(API_ENDPOINTS.CAMPAIGNS, {
      method: "GET",
    });
  },

  // Get donation history
  getDonationHistory: async (): Promise<any[]> => {
    return apiRequestWithAuth(
      API_ENDPOINTS.DONATION_HISTORY || "/api/donations/history",
      {
        method: "GET",
      }
    );
  },

  // Appointment management
  bookAppointment: async (appointmentData: {
    hospitalId: string;
    date: string;
    time: string;
    region: string;
  }): Promise<any> => {
    return apiRequestWithAuth(
      API_ENDPOINTS.APPOINTMENTS || "/api/appointments",
      {
        method: "POST",
        body: JSON.stringify(appointmentData),
      }
    );
  },

  getAppointments: async (): Promise<any[]> => {
    return apiRequestWithAuth(
      API_ENDPOINTS.APPOINTMENTS || "/api/appointments",
      {
        method: "GET",
      }
    );
  },

  rescheduleAppointment: async (
    appointmentId: string,
    newDate: string,
    newTime: string
  ): Promise<any> => {
    return apiRequestWithAuth(
      `${API_ENDPOINTS.APPOINTMENTS || "/api/appointments"}/${appointmentId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ date: newDate, time: newTime }),
      }
    );
  },

  cancelAppointment: async (appointmentId: string): Promise<any> => {
    return apiRequestWithAuth(
      `${API_ENDPOINTS.APPOINTMENTS || "/api/appointments"}/${appointmentId}`,
      {
        method: "DELETE",
      }
    );
  },
};
