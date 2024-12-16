import { API_PROFILES } from "../../api/constants";
import { loggedInHeaders } from "../../api/headers";

/**
 * Initializes the Edit Profile functionality, including image previews, form submission, and cancel behavior.
 */
export function editProfile() {
  const editProfileContainer = document.getElementById("edit-profile-container");
  const avatarInput = document.getElementById("avatar-url");
  const avatarPreview = document.getElementById("preview-avatar");
  const bannerInput = document.getElementById("banner-url");
  const bannerPreview = document.getElementById("preview-banner");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const form = document.getElementById("edit-profile-form");

  avatarInput.addEventListener("input", () => {
    const url = avatarInput.value;
    avatarPreview.src = url || "";
    avatarPreview.classList.toggle("hidden", !url);
  });

  bannerInput.addEventListener("input", () => {
    const url = bannerInput.value;
    bannerPreview.src = url || "";
    bannerPreview.classList.toggle("hidden", !url);
  });

  cancelBtn.addEventListener("click", () => {
    editProfileContainer.classList.add("hidden");
    avatarInput.value = "";
    bannerInput.value = "";
    avatarPreview.classList.add("hidden");
    bannerPreview.classList.add("hidden");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userName = localStorage.getItem("userName");
    if (!userName) {
      alert("User not logged in. Please log in to edit your profile.");
      return;
    }

    const avatarUrl = avatarInput.value;
    const bannerUrl = bannerInput.value;

    const requestBody = {
      avatar: avatarUrl ? { url: avatarUrl, alt: "User's Avatar" } : undefined,
      banner: bannerUrl ? { url: bannerUrl, alt: "User's Banner" } : undefined,
    };

    try {
      const myHeaders = await loggedInHeaders();
      const response = await fetch(`${API_PROFILES}/${userName}`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to update profile: ${errorData.message}`);
        return;
      }

      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      alert("An error occurred while updating the profile. Please try again.");
    }
  });
}
