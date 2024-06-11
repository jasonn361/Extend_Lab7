import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6840DKM78iC3Ia86rAHNsd17OJg5hpdM",
  authDomain: "lab7extend.firebaseapp.com",
  projectId: "lab7extend",
  storageBucket: "lab7extend.appspot.com",
  messagingSenderId: "966217811640",
  appId: "1:966217811640:web:3c33e22212692f7c45564d",
  measurementId: "G-C1E3GR2DEX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
