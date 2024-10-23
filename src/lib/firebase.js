import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvy0hX1yH3LNC99SHI8wueS7hL_TqQtmo",
  authDomain: "chat-app3645.firebaseapp.com",
  projectId: "chat-app3645",
  storageBucket: "chat-app3645.appspot.com",
  messagingSenderId: "959352431791",
  appId: "1:959352431791:web:675b855acfe16080f4205a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()