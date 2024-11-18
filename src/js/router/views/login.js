import { onLogin } from "../../ui/auth/login";

const form = document.forms.login;

/**
 * Adds a submit event listener to the login form.
 * 
 * When the form is submitted, the `onLogin` function is called to handle the login process.
 */
form.addEventListener("submit", onLogin);