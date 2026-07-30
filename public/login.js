import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

const message = document.getElementById("message");

function showMessage(text, color) {
    message.innerHTML = text;
    message.style.color = color;
}

function disableButtons(state) {
    loginBtn.disabled = state;
    signupBtn.disabled = state;

    loginBtn.textContent = state ? "Please wait..." : "Login";
    signupBtn.textContent = state ? "Please wait..." : "Create Account";
}

// LOGIN
loginBtn.addEventListener("click", async () => {

    if (email.value.trim() === "" || password.value.trim() === "") {
        showMessage("Please enter your email and password.", "red");
        return;
    }

    disableButtons(true);

    try {

        await signInWithEmailAndPassword(
            auth,
            email.value.trim(),
            password.value
        );

        showMessage("✅ Login Successful!", "green");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        let errorMessage = "Login failed.";

        switch (error.code) {

            case "auth/invalid-email":
                errorMessage = "Invalid email address.";
                break;

            case "auth/user-not-found":
                errorMessage = "No account found.";
                break;

            case "auth/invalid-credential":
                errorMessage = "Incorrect email or password.";
                break;

            case "auth/wrong-password":
                errorMessage = "Incorrect password.";
                break;

            default:
                errorMessage = error.message;
        }

        showMessage("❌ " + errorMessage, "red");

    } finally {

        disableButtons(false);

    }

});

// SIGN UP
signupBtn.addEventListener("click", async () => {

    if (email.value.trim() === "" || password.value.trim() === "") {
        showMessage("Please enter your email and password.", "red");
        return;
    }

    disableButtons(true);

    try {

        await createUserWithEmailAndPassword(
            auth,
            email.value.trim(),
            password.value
        );

        showMessage("✅ Account Created Successfully!", "green");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        let errorMessage = "Registration failed.";

        switch (error.code) {

            case "auth/email-already-in-use":
                errorMessage = "This email is already registered.";
                break;

            case "auth/invalid-email":
                errorMessage = "Invalid email address.";
                break;

            case "auth/weak-password":
                errorMessage = "Password must be at least 6 characters.";
                break;

            default:
                errorMessage = error.message;
        }

        showMessage("❌ " + errorMessage, "red");

    } finally {

        disableButtons(false);

    }

});