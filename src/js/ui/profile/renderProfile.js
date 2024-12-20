import { FALLBACK_AVATAR, FALLBACK_BANNER } from "../../api/constants";
import { readProfile } from "../../api/profile/read";
import { renderListingsByUser } from "./Renderlistings";

/**
 * Fetches and renders the user's profile.
 *
 * This function dynamically populates the user's profile data fetched
 * from the API. It updates the DOM elements, including the user's name, avatar(s),
 * banner, and statistics (credits, bids, wins). If an error occurs, it logs the error
 * and displays a fallback error message in the `profileContainer`.
 *
 * @async
 * @function renderProfile
 * @returns {Promise<void>} Resolves when the profile is successfully rendered.
 * @throws Will log an error if the network request fails or profile data is unavailable.
 */
export async function renderProfile() {
  try {
    const userName = localStorage.getItem("userName");
    if (!userName) {
      return;
    }

    const profile = await readProfile(userName);

    const avatars = document.querySelectorAll(".profile-pic");
    const banner = document.querySelector(".banner");
    const author = document.querySelector(".author");
    const creditAmount = document.querySelector(".credit-amount");
    const listingsAmount = document.querySelector(".listings-amount");
    const winAmount = document.querySelector(".win-amount");

    if (author) {
      author.textContent = profile.data.name;
    }

    avatars.forEach((avatar) => {
      avatar.src = profile.data.avatar?.url || FALLBACK_AVATAR;
      avatar.alt = profile.data.avatar?.alt || `${profile.data.name}'s Avatar`;
    });

    if (banner) {
      banner.src = profile.data.banner?.url || FALLBACK_BANNER;
      banner.alt = profile.data.banner?.alt || `${profile.data.name}'s Banner`;
    }

    if (creditAmount) creditAmount.textContent = `${profile.data.credits || 0} NOK`;
    if (listingsAmount) listingsAmount.textContent = profile.data._count?.listings || 0;
    if (winAmount) winAmount.textContent = profile.data._count?.wins || 0;
  } catch (error) {

    const profileContainer = document.getElementById("profile-container");
    if (profileContainer) {
      profileContainer.innerHTML =
        "<p>Error loading profile. Please try again later.</p>";
    }
  }
}

