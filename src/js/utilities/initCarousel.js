export function initCarousel() {
    const carouselControlsContainer = document.querySelector('.carousel-controls');
    const carouselControls = ['previous', 'next'];
    const carouselItems = [...document.querySelectorAll('.carousel-item')]; // Convert NodeList to array
  
    let carouselArray = [...carouselItems]; // Maintain the current state of the carousel items
  
    function updateCarousel() {
      // Remove all existing item classes
      carouselArray.forEach((el) => {
        for (let i = 1; i <= 5; i++) {
          el.classList.remove(`carousel-item-${i}`);
        }
      });
  
      // Assign new item classes to the first 5 items
      carouselArray.slice(0, 5).forEach((el, i) => {
        el.classList.add(`carousel-item-${i + 1}`);
      });
    }
  
    function setCurrentState(direction) {
      // Adjust the carousel array based on the direction
      if (direction.className.includes('carousel-controls-previous')) {
        carouselArray.unshift(carouselArray.pop());
      } else {
        carouselArray.push(carouselArray.shift());
      }
      updateCarousel(); // Update the carousel display
    }
  
   function setControls() {
  // Create control buttons dynamically
  carouselControls.forEach((control) => {
    const button = document.createElement('button');
    button.className = `carousel-controls-${control}`;
    // Add Font Awesome icons
    const icon = document.createElement('i');
    icon.className = control === 'previous' ? 'fa-solid fa-circle-chevron-left' : 'fa-solid fa-circle-chevron-right';
    
    button.appendChild(icon); // Append the icon to the button
    carouselControlsContainer.appendChild(button); // Append the button to the controls container
  });
}
  
    function useControls() {
      // Add event listeners to control buttons
      const triggers = [...carouselControlsContainer.childNodes];
      triggers.forEach((control) => {
        control.addEventListener('click', (e) => {
          e.preventDefault();
          setCurrentState(control);
        });
      });
    }
  
    // Initialize the carousel
    setControls(); // Add navigation controls
    useControls(); // Attach event listeners
    updateCarousel(); // Initial setup to apply classes
  }
  