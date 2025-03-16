import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCbFzc3fFqQgQBvIxbG9TT8jPWeXtWEtNg",
  authDomain: "resourcing-ee800.firebaseapp.com",
  projectId: "resourcing-ee800",
  storageBucket: "resourcing-ee800.firebasestorage.app",
  messagingSenderId: "574006926294",
  appId: "1:574006926294:web:91a781b6d5c26846226277"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
