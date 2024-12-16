/**
 * Truncates text if it exceeds the word or character limit.
 *
 * @param {string} text - The text to truncate.
 * @param {number} wordLimit - The maximum number of words.
 * @param {number} charLimit - The maximum number of characters.
 * @returns {string} - The truncated text with "..." if limits are exceeded.
 */
export function truncateText(text, wordLimit = 20, charLimit = 40) {
    if (!text) return "";
  
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
  
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "...";
    }
  
    return text;
  }
  