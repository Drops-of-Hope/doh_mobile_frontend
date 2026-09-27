import { CalendarData } from "./types";

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
