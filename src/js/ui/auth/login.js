import { login } from '../../api/auth/login.js';

/**
 * Handles the login form submission by preventing default form behavior,
 * retrieving email and password, and calling the API to log the user in.
 *
 * If the login is successful, the user is redirected to the homepage.
 * 
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} Redirects the user to the homepage on success or shows an error on failure.
 */
export async function onLogin(event) {
  event.preventDefault(); 
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const result = await login({ email, password });

    if (result.error) {
      alert("Login failed: " + result.error);
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An unexpected error occurred. Please try again later.');
  }
}