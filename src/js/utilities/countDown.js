// Function to start a countdown timer
export function startCountdown(endTimeString, displayElementId) {
    const endTime = new Date(endTimeString).getTime();
  
    // Update the countdown every second
    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = endTime - now;
  
      // If the countdown is over
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        document.getElementById(displayElementId).textContent = "Time's up!";
        return;
      }
  
      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
      // Update the display
      const displayElement = document.getElementById(displayElementId);
      displayElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }
  