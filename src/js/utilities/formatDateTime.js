/**
 * Formats a given date-time string into a localized date and time string.
 *
 * @function formatDateTime
 * @param {string} dateTimeString - The date-time string to format (ISO 8601 format or similar).
 * @returns {string} A string representing the formatted date and time, localized to the user's locale.
 *
 * @example
 * const formatted = formatDateTime("2024-12-17T12:30:00Z");
 * console.log(formatted); // Output: "12/17/2024, 12:30:00 PM" (depending on locale)
 */
export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
}
