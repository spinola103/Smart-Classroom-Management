// src/Firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBBytRhNr0rDm9GIXpy1whk6NbyIm78BcE",
    authDomain: "smart-classroom-3e421.firebaseapp.com",
    projectId: "smart-classroom-3e421",
    storageBucket: "smart-classroom-3e421.appspot.com",
    messagingSenderId: "815860070260",
    appId: "1:815860070260:web:354aee90c29fb894575e21",
    measurementId: "G-866E2PCQBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);


