import { initializeApp } from "firebase/app";
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const db = getFirestore(app);




//LOS SERVICIO DE
//AUTH
//login

export const onSignIn = async ({ email, password }) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.log(error);
  }
};

//logout
export const logOut = () => {
  signOut(auth);
};

//login con google
let googleProvider = new GoogleAuthProvider();
export const loginGoogle = async () => {
  const res = await signInWithPopup(auth, googleProvider);
  return res;
};

//Registro
export const signUp = async ({ email, password }) => {
  let res = await createUserWithEmailAndPassword(auth, email, password);
  return res;
};
//olvide la contraseña
export const forgotPassword = async (email) => {
  let res = await sendPasswordResetEmail(auth, email);
  return res;
};
//base de datos
//storage
