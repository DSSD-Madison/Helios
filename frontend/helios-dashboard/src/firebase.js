import { ReCaptchaV3Provider, initializeAppCheck } from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const store = getStorage(app);
const functions = getFunctions(app);

export const getIrradianceDataForPrevYear = httpsCallable(
  functions,
  "getIrradianceDataForPrevYear"
);

// process.env.NODE_ENV automatically defined by create-react-app:
// https://create-react-app.dev/docs/adding-custom-environment-variables
if (process.env.NODE_ENV !== "production") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(store, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
} else {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      "6Leeq84kAAAAAIHV61GG8G9AueH53aNHZuqIoYCA"
    ),
    isTokenAutoRefreshEnabled: true,
  });
}

export { auth, db, store };
