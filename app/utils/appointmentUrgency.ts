// Relative-time classification for appointments.
//
// Appointment dates are stored as UTC midnight (the booking form sends a bare
// "YYYY-MM-DD"), which reads as 05:30 local in Sri Lanka. Comparing raw
// timestamps therefore produces off-by-one day counts, so every comparison
// here zeroes both sides to local midnight first.

export type AppointmentUrgency = "today" | "tomorrow" | "dayAfter" | "soon" | "later";

/**
 * "YYYY-MM-DD" in local time. Unlike `date.toISOString().split("T")[0]`,
 * this never rolls back to the previous day for the early-morning hours in
 * UTC+ offsets (e.g. 00:00-05:30 in Sri Lanka).
 */
export const toLocalISODate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Calendar days from today to `date`, in local time. Negative when past. */
export const daysUntil = (date: string | Date): number => {
  const target = date instanceof Date ? date : new Date(date);
  if (isNaN(target.getTime())) return NaN;

  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((startOfTarget.getTime() - startOfToday.getTime()) / 86400000);
};

export const getUrgency = (date: string | Date): AppointmentUrgency => {
  const days = daysUntil(date);
  if (isNaN(days)) return "later";
  if (days <= 0) return "today"; // anything already past still reads as "today"
  if (days === 1) return "tomorrow";
  if (days === 2) return "dayAfter";
  if (days === 3) return "soon";
  return "later";
};

/** True for anything 3 days out or closer — the alarming card treatment. */
export const isUrgent = (urgency: AppointmentUrgency): boolean => urgency !== "later";

/** i18n key for the card's relative headline. "soon" needs a `days` param. */
export const urgencyLabelKey = (urgency: AppointmentUrgency): string => {
  switch (urgency) {
    case "today":
      return "home.appointment_today";
    case "tomorrow":
      return "home.appointment_tomorrow";
    case "dayAfter":
      return "home.appointment_day_after";
    case "soon":
      return "home.appointment_in_days";
    default:
      return "home.next_appointment";
  }
};
