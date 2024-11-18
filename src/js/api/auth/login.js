import { API_AUTH_LOGIN } from '../constants';
import { headers } from '../headers';

/**
 * Logs in a user by sending a POST request with email and password to the login API with API key.
 * After a successful login, the accessToken from the response is stored in local storage.
 * 
 * @async
 * @param {Object} userCredentials - An object containing the user's login credentials.
 * @param {string} userCredentials.email - The user's email address.
 * @param {string} userCredentials.password - The user's password.
 * 
 * @returns {Promise<Object>} A promise that resolves with the server's response in JSON format,
 * or an object containing an error message if the login fails.
 * 
 * @throws {Error} Will throw an error if the API request fails or the response is not ok.
 */
export async function login({ email, password }) {
    try {
        const response = await fetch(API_AUTH_LOGIN, {
            method: "POST",
            headers: await headers(),
            body: JSON.stringify({ email, password }),
        });
    
        if (!response.ok) {
            throw new Error("Login failed. Please check your credentials.");
        }
    
        const data = await response.json();
        
        if (data?.data?.accessToken) {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('userName', data.data.name);
        }

        return data;
    } catch (error) {
        console.error("Error during API login:", error);
        return { error: error.message };
    }
}