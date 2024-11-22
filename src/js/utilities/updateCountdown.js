/**
 * Updates the countdown timer for the auction end time.
 *
 * @param {Date} endDate - The end date of the auction.
 * @param {HTMLElement} timerElement - The DOM element to update the countdown.
 */
export function updateCountdown(endDate, timerElement) {
    function calculateTimeLeft() {
      const now = new Date();
      const timeLeft = endDate - now;
  
      if (timeLeft <= 0) {
        timerElement.textContent = "Auction Ended";
        clearInterval(intervalId);
        return;
      }
  
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
  
      timerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  
    calculateTimeLeft(); // Initialize immediately
    const intervalId = setInterval(calculateTimeLeft, 1000);
  }
  