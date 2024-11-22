import { placeBid } from "../../api/listing/bid";
import { renderListingById } from "../../ui/listing/display";
import { readListing } from "../../api/listing/read";


/**
 * Initializes the bid form functionality.
 *
 * This function sets up the event listener for the bid form
 * and handles bid placement when the form is submitted.
 *
 * @function setupBidForm
 */
export function setupBidForm() {
  const bidForm = document.getElementById("bid-form");

  if (!bidForm) {
    console.error("Bid form not found on the page.");
    return;
  }

  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const listing = await readListing();
    const bidInput = document.getElementById("bid-amount");
    const bidAmount = parseFloat(bidInput.value);
    const lastBidAmount = listing.bids && listing.bids.length > 0
    ? listing.bids[listing.bids.length - 1].amount
    : "0";

    console.log(`last bid amount:${lastBidAmount}`);

    bidInput.placeholder = `Enter more than ${lastBidAmount} NOK`;

    try {
      const response = await placeBid(bidAmount);
      alert("Bid placed successfully!");
      console.log("Bid response:", response);

      // Re-render the listing details and last bids section
      renderListingById();
    } catch (error) {
      alert(`Failed to place bid: ${error.message}`);
      console.error("Error during bid placement:", error);
    } finally {
      // Reset the bid form input field
      bidInput.value = "";
    }
  });
}
