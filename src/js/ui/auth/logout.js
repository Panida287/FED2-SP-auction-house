/**
 * Logs out the current user by clearing authentication data and redirecting to the login page.
 * 
 * This function removes the 'accessToken' and 'userName' from the local storage,
 * effectively ending the user's session. After clearing the data, it redirects
 * the user to the login page to prompt for re-authentication.
 */
export function onLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    window.location.href = '/';
}
