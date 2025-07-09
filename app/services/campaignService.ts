// Campaign service for handling campaign-related API calls
interface Campaign {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  donationGoal: number;
  currentDonations: number;
  totalAttendance: number;
  screenedPassed: number;
  walkInsScreened: number;
  status: 'active' | 'pending_approval' | 'completed' | 'cancelled';
  organizerId: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  requirements?: string;
  additionalNotes?: string;
  createdAt: string;
  approvalStatus?: {
    status: 'approved' | 'rejected' | 'pending';
    comment?: string;
    reviewedAt?: string;
    reviewedBy?: string;
  };
}

interface CampaignForm {
  title: string;
  description: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  donationGoal: number;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  requirements?: string;
  additionalNotes?: string;
}

interface AttendanceRecord {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  userEmail: string;
  bloodType: string;
  isWalkIn: boolean;
  screeningPassed: boolean;
  timestamp: string;
  markedBy: string; // organizer ID
}

class CampaignService {
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

  // Get campaigns for an organizer
  async getOrganizerCampaigns(organizerId: string): Promise<Campaign[]> {
    try {
      // Mock implementation - replace with actual API call
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          title: 'Blood Drive at City Hospital',
          description: 'Annual blood donation drive to support emergency blood needs.',
          location: 'Main Street Hospital',
          address: '123 Main Street, Colombo 07',
          date: '2025-07-15',
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          donationGoal: 100,
          currentDonations: 65,
          totalAttendance: 120,
          screenedPassed: 85,
          walkInsScreened: 25,
          status: 'active',
          organizerId,
          contactPerson: 'Dr. John Doe',
          contactPhone: '+94771234567',
          contactEmail: 'john.doe@hospital.lk',
          requirements: 'Valid ID required',
          additionalNotes: 'Free health checkup available',
          createdAt: '2025-07-01T10:00:00Z',
          approvalStatus: {
            status: 'approved',
            comment: 'Approved for public health benefit',
            reviewedAt: '2025-07-02T14:30:00Z',
            reviewedBy: 'admin@bloodbank.lk'
          }
        },
        {
          id: '2',
          title: 'University Blood Campaign',
          description: 'Campus-wide blood donation initiative for students and staff.',
          location: 'UCSC Campus',
          address: 'University of Colombo School of Computing, Colombo 07',
          date: '2025-07-20',
          startTime: '10:00 AM',
          endTime: '04:00 PM',
          donationGoal: 150,
          currentDonations: 0,
          totalAttendance: 0,
          screenedPassed: 0,
          walkInsScreened: 0,
          status: 'pending_approval',
          organizerId,
          contactPerson: 'Prof. Jane Smith',
          contactPhone: '+94712345678',
          contactEmail: 'jane.smith@ucsc.cmb.ac.lk',
          requirements: 'University ID required for students/staff',
          additionalNotes: 'Refreshments will be provided',
          createdAt: '2025-07-05T15:30:00Z',
          approvalStatus: {
            status: 'pending',
            comment: 'Under review by medical team'
          }
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockCampaigns;
    } catch (error) {
      console.error('Failed to fetch organizer campaigns:', error);
      throw new Error('Failed to fetch campaigns');
    }
  }

  // Create a new campaign
  async createCampaign(campaignData: CampaignForm & { organizerId: string }): Promise<Campaign> {
    try {
      const newCampaign: Campaign = {
        id: Date.now().toString(), // Mock ID generation
        ...campaignData,
        currentDonations: 0,
        totalAttendance: 0,
        screenedPassed: 0,
        walkInsScreened: 0,
        status: 'pending_approval',
        createdAt: new Date().toISOString(),
        approvalStatus: {
          status: 'pending',
          comment: 'Submitted for review'
        }
      };

      // Mock API call - replace with actual implementation
      console.log('Creating campaign:', newCampaign);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return newCampaign;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw new Error('Failed to create campaign');
    }
  }

  // Get campaign statistics
  async getCampaignStats(campaignId: string): Promise<{
    totalAttendance: number;
    screenedPassed: number;
    walkInsScreened: number;
    goalProgress: number;
    currentDonations: number;
    donationGoal: number;
  }> {
    try {
      // Mock implementation - replace with actual API call
      const mockStats = {
        totalAttendance: 120,
        screenedPassed: 85,
        walkInsScreened: 25,
        goalProgress: 65,
        currentDonations: 65,
        donationGoal: 100,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockStats;
    } catch (error) {
      console.error('Failed to fetch campaign stats:', error);
      throw new Error('Failed to fetch campaign statistics');
    }
  }

  // Mark attendance for a participant
  async markAttendance(attendanceData: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    try {
      const attendance: AttendanceRecord = {
        id: Date.now().toString(), // Mock ID generation
        ...attendanceData,
      };

      // Mock API call - replace with actual implementation
      console.log('Marking attendance:', attendance);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return attendance;
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      throw new Error('Failed to mark attendance');
    }
  }

  // Get attendance records for a campaign
  async getCampaignAttendance(campaignId: string): Promise<AttendanceRecord[]> {
    try {
      // Mock implementation - replace with actual API call
      const mockAttendance: AttendanceRecord[] = [
        {
          id: '1',
          campaignId,
          userId: 'user1',
          userName: 'Alice Johnson',
          userEmail: 'alice@example.com',
          bloodType: 'A+',
          isWalkIn: false,
          screeningPassed: true,
          timestamp: '2025-07-15T10:30:00Z',
          markedBy: 'organizer1'
        },
        {
          id: '2',
          campaignId,
          userId: 'user2',
          userName: 'Bob Smith',
          userEmail: 'bob@example.com',
          bloodType: 'O-',
          isWalkIn: true,
          screeningPassed: true,
          timestamp: '2025-07-15T11:15:00Z',
          markedBy: 'organizer1'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockAttendance;
    } catch (error) {
      console.error('Failed to fetch campaign attendance:', error);
      throw new Error('Failed to fetch attendance records');
    }
  }

  // Update campaign status (for admin approval)
  async updateCampaignStatus(
    campaignId: string, 
    status: 'approved' | 'rejected', 
    comment?: string
  ): Promise<Campaign> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Updating campaign status:', { campaignId, status, comment });
      
      // This would typically be called by admin users only
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return updated campaign (mock)
      throw new Error('This would return the updated campaign from the API');
    } catch (error) {
      console.error('Failed to update campaign status:', error);
      throw new Error('Failed to update campaign status');
    }
  }
}

export const campaignService = new CampaignService();
export type { Campaign, CampaignForm, AttendanceRecord };
