import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCnMJiSgpv5sJaLsdXEhF5D-RaNxZbjIfE",
    authDomain: "leveling-320d6.firebaseapp.com",
    projectId: "leveling-320d6",
    storageBucket: "leveling-320d6.firebasestorage.app",
    messagingSenderId: "983915951111",
    appId: "1:983915951111:web:a8cd8c34fd8c4722c8a6a2",
    measurementId: "G-SJLWEY6HDZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);