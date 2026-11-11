
/**
 * Shared input validation for PawPrint forms.
 */

// Checks whether required text contains actual content.
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

// Checks for a basic valid email format.
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Checks whether text is within an allowed length.
export function isValidLength(
  value: string,
  maxLength: number
): boolean {
  return value.trim().length <= maxLength;
}

// Checks whether a date is real and formatted YYYY-MM-DD.
export function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

// Checks for 24-hour time formatted HH:MM.
export function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}
