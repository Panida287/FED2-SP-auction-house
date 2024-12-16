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
          history.back();
        } else {
          window.location.href = fallbackUrl;
        }
      });
    }
  }

  