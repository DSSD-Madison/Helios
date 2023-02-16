import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAaZSAsa9-7O_ffxqPPVbUsMZ13eDXH7TU",
  authDomain: "helios-9d435.firebaseapp.com",
  projectId: "helios-9d435",
  storageBucket: "helios-9d435.appspot.com",
  messagingSenderId: "768984637940",
  appId: "1:768984637940:web:26f649874f0c813cbdd9a1",
  measurementId: "G-J5PH785LE0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
