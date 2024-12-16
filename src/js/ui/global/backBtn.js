/**
 * Handles the back button navigation.
 * If a referrer exists, it navigates to the previous page,
 * otherwise, it redirects to a default fallback page.
 *
 * @param {string} fallbackUrl - The default URL to navigate to if there's no referrer.
 */
export function backButton(fallbackUrl = "/") {
    const backButton = document.getElementById("back-btn");
  
    if (backButton) {
      backButton.addEventListener("click", () => {
        if (document.referrer) {
          // Go back to the previous page in the history stack
          history.back();
        } else {
          // Fallback to a default page if there's no referrer
          window.location.href = fallbackUrl;
        }
      });
    }
  }

  