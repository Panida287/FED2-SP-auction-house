export function backToTop(targetId, scrollPosition) {
    const backToTopBtn = document.getElementById(targetId);
  
    backToTopBtn.addEventListener("click", () => {
      const scrollTarget = document.documentElement.scrollTop ? document.documentElement : document.body;
  
      scrollTarget.scrollTo({
        top: scrollPosition, // Set the desired scroll position
        behavior: "smooth", // Enable smooth scrolling
      });
    });
  }
  
  // Example usage:
  // Adds the back-to-top functionality for a button with the ID "back-to-top" that scrolls to position 1050
  backToTop("back-to-top", 1050);
  