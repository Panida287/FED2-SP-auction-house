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

    timerElement.innerHTML = `
      <div class="backdrop-blur-sm  bg-black/50 p-2 rounded-md flex gap-2 text-white text-xs">
        <div class="flex flex-col items-center justify-center bg-accent/80 rounded-md px-2 py-1">
          <span class="font-bold">${days}</span>
          <span class="uppercase text-gray-300 text-[10px]">Days</span>
        </div>
        <div class="flex flex-col items-center justify-center bg-accent/80 rounded-md px-2 py-1">
          <span class="font-bold">${hours.toString().padStart(2, '0')}</span>
          <span class="uppercase text-gray-300 text-[10px]">Hours</span>
        </div>
        <div class="flex flex-col items-center justify-center bg-accent/80 rounded-md px-2 py-1">
          <span class="font-bold">${minutes.toString().padStart(2, '0')}</span>
          <span class="uppercase text-gray-300 text-[10px]">Minutes</span>
        </div>
        <div class="flex flex-col items-center justify-center bg-accent/80 rounded-md px-2 py-1">
          <span class="font-bold">${seconds.toString().padStart(2, '0')}</span>
          <span class="uppercase text-gray-300 text-[10px]">Seconds</span>
        </div>
      </div>
    `;
  }

  calculateTimeLeft();
  const intervalId = setInterval(calculateTimeLeft, 1000);
}


