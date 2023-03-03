import { firebaseConfig } from "./config";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const store = getStorage(app);

// process.env.NODE_ENV automatically defined by create-react-app: 
// https://create-react-app.dev/docs/adding-custom-environment-variables
if (process.env.NODE_ENV !== "production") {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(store, 'localhost', 9199);
}

export { auth, db, store };
