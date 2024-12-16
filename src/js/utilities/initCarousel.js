/**
 * Initializes a carousel with dynamic navigation controls and item transitions.
 *
 * This function sets up the carousel's state, creates navigation controls, 
 * and updates item classes to reflect the current carousel position.
 *
 * @function initCarousel
 * @description
 * - Dynamically creates "previous" and "next" controls with FontAwesome icons.
 * - Adds event listeners to control navigation.
 * - Updates the carousel items' classes based on the current state.
 */
export function initCarousel() {
  const carouselControlsContainer = document.querySelector('.carousel-controls');
  const carouselControls = ['previous', 'next'];
  const carouselItems = [...document.querySelectorAll('.carousel-item')];

  let carouselArray = [...carouselItems];

  /**
   * Updates the carousel display by re-assigning classes to the current items.
   */
  function updateCarousel() {
    carouselArray.forEach((el) => {
      for (let i = 1; i <= 5; i++) {
        el.classList.remove(`carousel-item-${i}`);
      }
    });

    carouselArray.slice(0, 5).forEach((el, i) => {
      el.classList.add(`carousel-item-${i + 1}`);
    });
  }

  /**
   * Updates the carousel state based on the navigation direction.
   *
   * @param {HTMLElement} direction - The button element that triggered the event.
   */
  function setCurrentState(direction) {
    if (direction.className.includes('carousel-controls-previous')) {
      carouselArray.unshift(carouselArray.pop());
    } else {
      carouselArray.push(carouselArray.shift());
    }
    updateCarousel();
  }

  /**
   * Creates the carousel navigation controls and appends them to the container.
   */
  function setControls() {
    carouselControls.forEach((control) => {
      const button = document.createElement('button');
      button.className = `carousel-controls-${control}`;
      const icon = document.createElement('i');
      icon.className = control === 'previous' ? 'fa-solid fa-circle-chevron-left' : 'fa-solid fa-circle-chevron-right';
      button.appendChild(icon);
      carouselControlsContainer.appendChild(button);
    });
  }

  /**
   * Adds click event listeners to the navigation controls.
   */
  function useControls() {
    const triggers = [...carouselControlsContainer.childNodes];
    triggers.forEach((control) => {
      control.addEventListener('click', (e) => {
        e.preventDefault();
        setCurrentState(control);
      });
    });
  }

  setControls();
  useControls();
  updateCarousel();
}
