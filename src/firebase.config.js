import { getFirestore } from 'firebase/firestore'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYpQIfiv2jaCp8Oml7y7rlluixWPsVFL0",
  authDomain: "fediscogs.firebaseapp.com",
  projectId: "fediscogs",
  storageBucket: "fediscogs.appspot.com",
  messagingSenderId: "490126638609",
  appId: "1:490126638609:web:f6ed16d55102c4c43d3bb0",
  measurementId: "G-WGTXJ7YW59"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
// const analytics = getAnalytics(app);