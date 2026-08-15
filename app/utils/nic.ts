// Derives a date of birth (and thus age) from a Sri Lankan NIC number.
//
// Old format: 9 digits + 1 check letter (V/X), e.g. "851234567V"
//   - digits 1-2: last two digits of birth year (assumed 19YY)
//   - digits 3-5: day-of-year, offset by 500 for female (subtract 500 first)
// New format: 12 digits, e.g. "199912345678"
//   - digits 1-4: full birth year
//   - digits 5-7: day-of-year, offset by 500 for female

function dayOfYearToDate(year: number, dayOfYear: number): Date | null {
  let day = dayOfYear;
  if (day > 500) day -= 500; // female offset
  if (day < 1 || day > 366) return null;

  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(date.getUTCDate() + (day - 1));
  if (date.getUTCFullYear() !== year) return null; // day rolled into next year — invalid
  return date;
}

export function parseNicBirthDate(nic: string | null | undefined): Date | null {
  if (!nic) return null;
  const cleaned = nic.trim().toUpperCase();

  if (/^\d{9}[VX]$/.test(cleaned)) {
    const yy = parseInt(cleaned.slice(0, 2), 10);
    const dayOfYear = parseInt(cleaned.slice(2, 5), 10);
    return dayOfYearToDate(1900 + yy, dayOfYear);
  }

  if (/^\d{12}$/.test(cleaned)) {
    const year = parseInt(cleaned.slice(0, 4), 10);
    const dayOfYear = parseInt(cleaned.slice(4, 7), 10);
    return dayOfYearToDate(year, dayOfYear);
  }

  return null;
}

export function ageFromNic(nic: string | null | undefined): number | null {
  const birthDate = parseNicBirthDate(nic);
  if (!birthDate) return null;

  const today = new Date();
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const hasHadBirthdayThisYear =
    today.getUTCMonth() > birthDate.getUTCMonth() ||
    (today.getUTCMonth() === birthDate.getUTCMonth() && today.getUTCDate() >= birthDate.getUTCDate());
  if (!hasHadBirthdayThisYear) age -= 1;

  return age >= 0 && age < 130 ? age : null;
}

export function ageFromBirthdate(birthdate: string | null | undefined): number | null {
  if (!birthdate) return null;
  const date = new Date(birthdate);
  if (isNaN(date.getTime())) return null;

  const today = new Date();
  let age = today.getUTCFullYear() - date.getUTCFullYear();
  const hasHadBirthdayThisYear =
    today.getUTCMonth() > date.getUTCMonth() ||
    (today.getUTCMonth() === date.getUTCMonth() && today.getUTCDate() >= date.getUTCDate());
  if (!hasHadBirthdayThisYear) age -= 1;

  return age >= 0 && age < 130 ? age : null;
}
