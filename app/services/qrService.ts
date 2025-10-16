import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

// Types for QR functionality
export interface QRCodeData {
  userId: string;
  userInfo: {
    name: string;
    bloodGroup: string;
    nic: string;
    totalDonations: number;
    donationBadge: string;
  };
  qrCode: string; // Base64 encoded QR code image
  generatedAt: string;
  expiresAt?: string;
}

export interface QRScanRequest {
  qrData: string; // The scanned QR code data (user ID)
  campaignId?: string;
  scanType: "CAMPAIGN_ATTENDANCE" | "DONATION_VERIFICATION" | "CHECK_IN" | "CHECK_OUT";
  metadata?: any;
}

export interface QRScanResult {
  success: boolean;
  scanId: string;
  scannedUser: {
    id: string;
    name: string;
    bloodGroup: string;
    totalDonations: number;
    donationBadge: string;
    eligibleToDonate: boolean;
  };
  campaign?: {
    id: string;
    title: string;
    location: string;
  };
  participation?: {
    id: string;
    status: string;
    registrationDate: string;
    attendanceMarked: boolean;
    donationCompleted: boolean;
  };
  message: string;
  timestamp: string;
}

export interface AttendanceMarkRequest {
  userId: string;
  campaignId: string;
  scanType?: "CHECK_IN" | "CHECK_OUT" | "DONATION_COMPLETED";
  notes?: string;
  autoRegister?: boolean; // Allow automatic registration if not already registered
  qrData?: string; // Raw QR data string when available (backend expects this)
}

export interface AttendanceMarkResult {
  success: boolean;
  participationId: string;
  status: string;
  pointsEarned?: number;
  message: string;
  updatedParticipation: {
    id: string;
    status: string;
    attendanceMarked: boolean;
    donationCompleted: boolean;
    pointsEarned: number;
    scannedAt?: string;
  };
}

export interface CampaignStats {
  campaignId: string;
  totalRegistered: number;
  totalAttended: number;
  totalDonationsCompleted: number;
  attendanceRate: number;
  completionRate: number;
  participants: CampaignParticipant[];
}

export interface CampaignParticipant {
  id: string;
  user: {
    id: string;
    name: string;
    bloodGroup: string;
    totalDonations: number;
  };
  registrationDate: string;
  status: string;
  attendanceMarked: boolean;
  donationCompleted: boolean;
  pointsEarned: number;
  scannedAt?: string;
  feedback?: string;
  feedbackRating?: number;
}

export interface ScannerPermissions {
  canScanAttendance: boolean;
  canMarkDonationComplete: boolean;
  canViewParticipants: boolean;
  canGenerateReports: boolean;
  allowedCampaigns: string[];
}

// QR Service functions
export const qrService = {
  // Generate QR code for user
  async generateUserQR(): Promise<QRCodeData> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.GENERATE_QR, {
        method: "POST",
      });
      return response.data;
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      throw error;
    }
  },

  // Scan a QR code
  async scanQR(request: QRScanRequest): Promise<QRScanResult> {
    try {
      const response = await apiRequestWithAuth(API_ENDPOINTS.QR_SCAN, {
        method: "POST",
        body: JSON.stringify(request),
      });
      
      // Handle the API response structure: { scanResult: {...}, success: true }
      if (response.success && response.scanResult) {
        return {
          success: true,
          scanId: response.scanResult.scanId,
          scannedUser: response.scanResult.scannedUser,
          message: "Scan successful",
          timestamp: response.scanResult.timestamp,
          campaign: response.scanResult.campaign,
          participation: response.scanResult.participation,
        };
      } else {
        throw new Error(response.message || "Scan failed");
      }
    } catch (error) {
      console.error("Failed to scan QR code:", error);
      throw error;
    }
  },

  // Mark attendance for a user
  async markAttendance(request: AttendanceMarkRequest): Promise<AttendanceMarkResult> {
    try {
      // Backend expects only campaignId and qrData (qrData can be raw UUID or a JSON string containing uid/userId/scannedUserId)
      const payload: { campaignId: string; qrData: string; notes?: string } = {
        campaignId: request.campaignId,
        qrData: request.qrData || request.userId, // fallback to raw userId as raw qrData
        ...(request.notes ? { notes: request.notes } : {}),
      };

      const response = await apiRequestWithAuth(API_ENDPOINTS.MARK_ATTENDANCE, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      throw error;
    }
  },

  // Auto-register user for campaign and mark attendance (for unregistered participants)
  async autoRegisterAndMarkAttendance(request: AttendanceMarkRequest): Promise<AttendanceMarkResult> {
    try {
      // First, try to register the user for the campaign
      const registrationResponse = await apiRequestWithAuth(
        API_ENDPOINTS.JOIN_CAMPAIGN.replace(":id", request.campaignId),
        {
          method: "POST",
          body: JSON.stringify({
            userId: request.userId,
            autoRegister: true,
            source: "QR_SCAN",
          }),
        }
      );

      if (registrationResponse.success) {
        // Now mark attendance
        const attendanceResponse = await apiRequestWithAuth(API_ENDPOINTS.MARK_ATTENDANCE, {
          method: "POST",
          body: JSON.stringify({
            ...request,
            notes: `${request.notes} - Auto-registered via QR scan`,
          }),
        });
        return attendanceResponse.data;
      } else {
        throw new Error(registrationResponse.message || "Auto-registration failed");
      }
    } catch (error) {
      console.error("Failed to auto-register and mark attendance:", error);
      throw error;
    }
  },

  // Get campaign statistics (for camp organizers)
  async getCampaignStats(campaignId: string): Promise<CampaignStats> {
    try {
      const response = await apiRequestWithAuth(
        API_ENDPOINTS.CAMPAIGN_PARTICIPANTS.replace(":id", campaignId)
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch campaign stats:", error);
      throw error;
    }
  },

  // Get campaign participants list
  async getCampaignParticipants(
    campaignId: string,
    filters?: {
      status?: string;
      attendanceMarked?: boolean;
      donationCompleted?: boolean;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    participants: CampaignParticipant[];
    statistics: {
      totalRegistered: number;
      totalAttended: number;
      totalCompleted: number;
      attendanceRate: number;
      completionRate: number;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const queryString = filters ? new URLSearchParams(filters as any).toString() : "";
      const response = await apiRequestWithAuth(
        `${API_ENDPOINTS.CAMPAIGN_PARTICIPANTS.replace(":id", campaignId)}${
          queryString ? `?${queryString}` : ""
        }`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch campaign participants:", error);
      throw error;
    }
  },

  // Check scanner permissions
  async getScannerPermissions(): Promise<ScannerPermissions> {
    try {
      const response = await apiRequestWithAuth("/qr/scanner-permissions");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch scanner permissions:", error);
      throw error;
    }
  },

  // Batch scan QR codes (for multiple users)
  async batchScanQR(requests: QRScanRequest[]): Promise<QRScanResult[]> {
    try {
      const response = await apiRequestWithAuth("/qr/batch-scan", {
        method: "POST",
        body: JSON.stringify({ scans: requests }),
      });
      return response.data.results;
    } catch (error) {
      console.error("Failed to batch scan QR codes:", error);
      throw error;
    }
  },

  // Update participation status
  async updateParticipationStatus(
    participationId: string,
    status: string,
    notes?: string
  ): Promise<{
    success: boolean;
    participation: CampaignParticipant;
    message: string;
  }> {
    try {
      const response = await apiRequestWithAuth(`/campaigns/participations/${participationId}`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update participation status:", error);
      throw error;
    }
  },

  // Add feedback for participation
  async addParticipationFeedback(
    participationId: string,
    feedback: string,
    rating: number
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiRequestWithAuth(
        `/campaigns/participations/${participationId}/feedback`,
        {
          method: "POST",
          body: JSON.stringify({ feedback, rating }),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add participation feedback:", error);
      throw error;
    }
  },

  // Get scan history for a user
  async getUserScanHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    scans: Array<{
      id: string;
      scanType: string;
      scanDateTime: string;
      campaign?: {
        id: string;
        title: string;
        location: string;
      };
      scanner: {
        id: string;
        name: string;
      };
      metadata?: any;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const response = await apiRequestWithAuth(
        `/qr/scan-history?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch scan history:", error);
      throw error;
    }
  },

  // Export campaign report
  async exportCampaignReport(
    campaignId: string,
    format: "csv" | "excel" | "pdf" = "csv"
  ): Promise<{
    downloadUrl: string;
    fileName: string;
  }> {
    try {
      const response = await apiRequestWithAuth(
        `/campaigns/${campaignId}/export?format=${format}`,
        {
          method: "POST",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to export campaign report:", error);
      throw error;
    }
  },
};

export default qrService;
