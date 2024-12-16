import { getKey } from "./auth/key";
import { API_KEY } from "./constants";

/**
 * Generates and returns a `Headers` object for authenticated API requests.
 *
 * This function includes:
 * - The API key (`X-Noroff-API-Key`) for the Noroff API.
 * - A JSON `Content-Type` header.
 * - An optional `Authorization` token retrieved from the `getKey` function.
 *
 * @async
 * @function loggedInHeaders
 * @returns {Promise<Headers>} A promise that resolves to a `Headers` object containing all necessary headers for authenticated requests.
 */
export async function loggedInHeaders() {
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

/**
 * Generates and returns a `Headers` object for general API requests.
 *
 * This function includes:
 * - The API key (`X-Noroff-API-Key`) for the Noroff API.
 * - A JSON `Content-Type` header.
 *
 * @function headers
 * @returns {Headers} A `Headers` object containing the necessary headers for non-authenticated requests.
 */
export function headers() {
  const headers = new Headers();

  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
    headers.append("Content-Type", "application/json");
  }

  return headers;
}
