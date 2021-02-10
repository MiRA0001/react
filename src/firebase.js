import firebase from "firebase";

const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyAyfjoA1Yci8-lwwBaeX3YdpAIeH8pedgg",
    authDomain: "instagram-clone-react-iweb.firebaseapp.com",
    projectId: "instagram-clone-react-iweb",
    storageBucket: "instagram-clone-react-iweb.appspot.com",
    messagingSenderId: "142701967901",
    appId: "1:142701967901:web:680419bf6ce784d75f64f4",
    measurementId: "G-6HRWB6BJWW"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage= firebase.storage();

export {db, auth, storage};