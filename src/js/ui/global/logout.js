
import { onLogout } from "../auth/logout";

/**
 * Adds a click event listener to the logout button.
 * 
 * When the logout button is clicked, this function prompts the user for confirmation.
 * If the user confirms, it calls the `onLogout` function to log the user out.
 */
export function setLogoutListener() {
    const logoutButton = document.querySelector('.logout-btn');
    
    logoutButton.addEventListener('click', () => {
        const confirmation = window.confirm("Are you sure you want to log out?");
        
        if (confirmation) {
            onLogout();
        }
    });
}

