
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,

} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyBauOHF0Vtd64576E88OyzAfQNRdrSJNFk",
    authDomain: "first-test-5cb7c.firebaseapp.com",
    databaseURL: "https://first-test-5cb7c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "first-test-5cb7c",
    storageBucket: "first-test-5cb7c.appspot.com",
    messagingSenderId: "660435885686",
    appId: "1:660435885686:web:79651774d881e4326ac957",
    measurementId: "G-4SEVYM8HRZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage();

export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    doc,
    setDoc,
    db,
    getDoc,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    ref,
    uploadBytes,
    uploadBytesResumable,
    storage,
    getDownloadURL,
    onSnapshot,
}