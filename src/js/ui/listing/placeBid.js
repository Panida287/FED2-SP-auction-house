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

  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const listing = await readListing();
    const bidInput = document.getElementById("bid-amount");
    const bidAmount = parseFloat(bidInput.value);
    const lastBidAmount = listing.bids && listing.bids.length > 0
    ? listing.bids[listing.bids.length - 1].amount
    : "0";

    bidInput.placeholder = `Enter more than ${lastBidAmount} NOK`;

    try {
      const response = await placeBid(bidAmount);
      alert("Bid placed successfully!");
      console.log("Bid response:", response);

      // Re-render the listing details and last bids section
      renderListingById();
    } catch (error) {
      alert(`Failed to place bid: ${error.message}`);
    } finally {
      // Reset the bid form input field
      bidInput.value = "";
    }
  });
}
