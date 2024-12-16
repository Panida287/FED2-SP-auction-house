import { register } from '../../api/auth/register.js';

/**
 * Handles the registration form submission.
 * 
 * This function prevents the default form submission behavior, collects the input values 
 * for name, email, password, bio, avatar, and banner from the form, and sends the data to the 
 * `register` API function. If the registration is successful, the user is redirected to the 
 * login page. If the registration fails, an error message is displayed.
 * 
 * @async
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} A promise that resolves when the registration process completes.
 * 
 * @throws {Error} Will throw an error if the API request fails or the registration is not successful.
 */

export async function onRegister(event) {
    event.preventDefault(); 

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        repeatPassword: document.getElementById('repeatPassword').value,
        avatar: document.getElementById('avatar') ? document.getElementById('avatar').value : null, 
        banner: document.getElementById('banner') ? document.getElementById('banner').value : null,
    };
    await register(formData);
}
