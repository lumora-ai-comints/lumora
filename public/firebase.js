// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJ5Sfi5yD-2cD7kwywlEXksewluPPDkB0",
    authDomain: "lumora-4eb6c.firebaseapp.com",
    projectId: "lumora-4eb6c",
    storageBucket: "lumora-4eb6c.firebasestorage.app",
    messagingSenderId: "375013733114",
    appId: "1:375013733114:web:7762e9b1269de5cf1d8f43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export Auth so other files can use it
export { auth };