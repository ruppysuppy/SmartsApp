import firebase from "firebase";

import firebaseConfig from "./config";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const analytics = firebase.analytics();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export default firebase;
