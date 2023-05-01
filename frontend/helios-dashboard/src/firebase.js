import { ReCaptchaV3Provider, initializeAppCheck } from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const store = getStorage(app);

// process.env.NODE_ENV automatically defined by create-react-app:
// https://create-react-app.dev/docs/adding-custom-environment-variables
if (process.env.NODE_ENV !== "production") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(store, "127.0.0.1", 9199);
} else {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      "6Leeq84kAAAAAIHV61GG8G9AueH53aNHZuqIoYCA"
    ),
    isTokenAutoRefreshEnabled: true,
  });
}

export { auth, db, store };