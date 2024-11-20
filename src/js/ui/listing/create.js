import { createListing } from "../../api/listing/create";

/**
 * Handles the Create Listing functionality, including image preview, validation, and form submission.
 *
 * This function allows users to create a new auction listing by filling out the form.
 * Users can preview the image as they input the URL, and the data is sent to the API
 * via a POST request. Required fields include title, description, image URL (media), and end date.
 *
 * @function onCreate
 * @async
 *
 * @requires createListing - The API function to create a new listing.
 *
 * @throws Will alert the user and prevent submission if required fields are missing.
 *
 * @param {Event} event - The form submission event.
 */
export async function onCreate(event) {
  event.preventDefault(); // Prevent default form submission

  const form = event.target;
  const titleInput = document.getElementById("item-name");
  const descriptionInput = document.getElementById("item-description");
  const categorySelect = document.getElementById("item-category");
  const mediaUrlInput = document.getElementById("item-image-url");
  const endsAtInput = document.getElementById("item-ends-at");
  const previewImage = document.getElementById("preview-image");

  // Validate required fields
  const title = titleInput?.value.trim();
  const description = descriptionInput?.value.trim();
  const mediaUrl = mediaUrlInput?.value.trim();
  const endsAt = endsAtInput?.value;

  if (!title) {
    alert("Title is required.");
    return;
  }
  if (!description) {
    alert("Description is required.");
    return;
  }
  if (!mediaUrl) {
    alert("Image URL is required.");
    return;
  }
  if (!endsAt) {
    alert("Auction end date and time are required.");
    return;
  }

  // Update the image preview dynamically
  mediaUrlInput.addEventListener("input", () => {
    if (mediaUrlInput.value) {
      previewImage.src = mediaUrlInput.value;
      previewImage.alt = title || "Image Preview";
      previewImage.classList.remove("hidden");
    } else {
      previewImage.classList.add("hidden");
    }
  });

  // Collect category tags from the selected options
  const tags = Array.from(categorySelect?.selectedOptions).map((option) => option.value);

  // Construct media array with title as the alt text
  const media = [{ url: mediaUrl, alt: title }];

  try {
    // Call the API to create the listing
    await createListing({
      title,
      description,
      tags,
      media,
      endsAt: new Date(endsAt).toISOString(),
    });

    // Handle success
    alert("Listing created successfully!");
    form.reset(); // Clear the form
    if (previewImage) previewImage.classList.add("hidden"); // Hide the preview after submission
  } catch (error) {
    // Handle errors
    console.error("Error creating listing:", error);
    alert("Failed to create listing. Please try again.");
  }
}
