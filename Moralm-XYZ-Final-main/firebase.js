import { initializeApp } from "firebase/app" 
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDjvMZ7T4odGQo15ys_6iB3zrQ44qBTfcU",
    authDomain: "moralm-firebase.firebaseapp.com",
    projectId: "moralm-firebase",
    storageBucket: "moralm-firebase.appspot.com",
    messagingSenderId: "301743702712",
    appId: "1:301743702712:web:0bf0bc0430c6c12dd82a4d",
    measurementId: "G-39FZRR23EE"
  };

const app = initializeApp(firebaseConfig) 
const db = getFirestore(app) 
export const auth = getAuth(app)

export {db}