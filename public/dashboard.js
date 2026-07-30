import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Check login status
onAuthStateChanged(auth, (user) => {

    if (user) {

        // Show user's email
        document.getElementById("welcome").textContent =
            "Welcome, " + user.email;

    } else {

        // Not logged in
        window.location.href = "login.html";

    }

});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {

    try {

        await signOut(auth);

        alert("Logged out successfully!");

        window.location.href = "login.html";

    } catch (error) {

        alert(error.message);

    }

});