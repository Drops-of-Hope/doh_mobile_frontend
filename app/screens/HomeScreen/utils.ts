import { Emergency, Campaign, CalendarData, UrgencyLevel } from "./types";

export const generateMockData = () => {
  const emergencies: Emergency[] = [
    {
      id: 1,
      hospital: "City General Hospital",
      bloodType: "O+ Needed",
      slotsUsed: 3,
      totalSlots: 10,
      urgency: "Critical" as UrgencyLevel,
      timeLeft: "2 hours left",
      description:
        "Critical shortage of O+ blood needed for emergency surgeries. Multiple patients in the ICU require immediate blood transfusions.",
      contactNumber: "+94 11 123 4567",
      address: "123 Main Street, Colombo 07",
      requirements: "Minimum 450ml donation, Age 18-65, Weight above 50kg",
    },
    {
      id: 2,
      hospital: "Negombo General Hospital",
      bloodType: "AB+ Needed",
      slotsUsed: 5,
      totalSlots: 8,
      urgency: "Critical" as UrgencyLevel,
      timeLeft: "4 hours left",
      description:
        "Urgent need for AB+ blood type for accident victims. Road traffic accident has resulted in multiple casualties requiring immediate medical attention.",
      contactNumber: "+94 31 234 5678",
      address: "456 Hospital Road, Negombo",
      requirements: "Minimum 450ml donation, Age 18-65, Weight above 50kg",
    },
  ];

  const upcomingCampaigns: Campaign[] = [
    {
      id: 1,
      title: "Emergency Relief Fund",
      date: "2025-07-05",
      location: "City General Hospital",
      slotsUsed: 65,
      totalSlots: 100,
      urgency: "Critical" as UrgencyLevel,
    },
    {
      id: 2,
      title: "University Blood Drive",
      date: "2025-07-12",
      location: "University of Colombo",
      slotsUsed: 23,
      totalSlots: 50,
      urgency: "Moderate" as UrgencyLevel,
    },
    {
      id: 3,
      title: "Community Health Fair",
      date: "2025-07-18",
      location: "Negombo Community Center",
      slotsUsed: 12,
      totalSlots: 75,
      urgency: "Low" as UrgencyLevel,
    },
  ];

  return { emergencies, upcomingCampaigns };
};

export const generateCalendarDays = (
  month: number,
  year: number,
): CalendarData[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: CalendarData[] = [];

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ day: null });
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const today = new Date();
    const isPast = date < today;
    const isToday = date.toDateString() === today.toDateString();
    const isAvailable = !isPast && !isWeekend;

    days.push({
      day,
      date,
      isAvailable,
      isPast,
      isWeekend,
      isToday,
    });
  }

  return days;
};

export const getMonthName = (month: number): string => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
};

export const getAvailableTimeSlots = (): string[] => {
  return [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];
};
