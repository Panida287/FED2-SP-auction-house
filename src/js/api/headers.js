import { getKey } from "./auth/key";
import { API_KEY } from "./constants";
/**
 * Asynchronously generates and returns a Headers object for API requests.
 * 
 * The function sets custom headers for the Noroff API, including an API key and
 * an Authorization token, if they are available. The token is retrieved using the `getKey` function.
 *
 * @async
 * @function headers
 * @returns {Promise<Headers>} A promise that resolves to a Headers object with appropriate API headers.
 */
export async function headers() {
  const token = await getKey();

  const headers = new Headers();
  
  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
    headers.append("Content-Type", "application/json");
  }

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  
  return headers;
}

