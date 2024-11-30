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
        timerElement.innerHTML = `<span class="text-red-500 font-bold">Auction Ended</span>`;
        clearInterval(intervalId);
        return;
      }
  
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
  
      // Dynamically inject the numbers into the boxes
      timerElement.innerHTML = `
        <div class="timer-container flex flex-col items-start justify-center">
          <h3>Countdown:</h3>
          <div class="dhms-container flex gap-4">
            <div class="time-container flex flex-col items-center">
              <div class="days-container flex gap-1">
                <span class="p-2 bg-slate-500 rounded-md text-white text-bold">${Math.floor(days / 10)}</span>
                <span class="p-2 bg-slate-500 rounded-md text-white text-bold">${days % 10}</span>
              </div>
              <span class="text-sm text-gray-600">Days</span>
            </div>   
            <div class="time-container flex flex-col items-center">
              <div class="hours-container flex gap-1">
                <span class="p-2 bg-slate-500 rounded-md text-white text-bold">${Math.floor(hours / 10)}</span>
                <span class="p-2 bg-slate-500 rounded-md text-white text-bold">${hours % 10}</span>
              </div>
              <span class="text-sm text-gray-600">Hours</span>
            </div>
            <span class="pt-2">
            :
            </span>
            <div class="time-container flex flex-col items-center">
              <div class="minutes-container flex gap-1">
                <span class="p-2 bg-slate-500 rounded-md text-white text-bold">${Math.floor(minutes / 10)}</span>
                <span class="p-2 bg-slate-500 rounded-md text-white text-bold">${minutes % 10}</span>
              </div>
              <span class="text-sm text-gray-600">Minutes</span>
            </div>
            <span class="pt-2">
            :
            </span>
            <div class="time-container flex flex-col items-center">
              <div class="seconds-container flex gap-1">
                <span class="p-2 bg-slate-500 rounded-md text-white text-bold">${Math.floor(seconds / 10)}</span>
                <span class="p-2 bg-slate-500 rounded-md text-white text-bold">${seconds % 10}</span>
              </div>
              <span class="text-sm text-gray-600">Seconds</span>
            </div>
          </div>
        </div>
      `;
    }
  
    calculateTimeLeft(); // Initialize immediately
    const intervalId = setInterval(calculateTimeLeft, 1000);
  }
  