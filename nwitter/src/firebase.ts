import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAoRFIwZUPzc5B2plSsOCp8TMqXEEjrFU",
  authDomain: "nwitter-64113.firebaseapp.com",
  projectId: "nwitter-64113",
  storageBucket: "nwitter-64113.appspot.com",
  messagingSenderId: "483348546499",
  appId: "1:483348546499:web:91d9c3a7994bf966447376",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
