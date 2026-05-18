import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVnJdDkr4tw4dD9lr8APcsAiGF5y3VUEg",
  authDomain: "lovepoints-d0cc6.firebaseapp.com",
  projectId: "lovepoints-d0cc6",
  storageBucket: "lovepoints-d0cc6.firebasestorage.app",
  messagingSenderId: "844599014745",
  appId: "1:844599014745:web:ed1c32be41ccd45b140848"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// login
export async function loginGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    uid: user.uid
  });

  return user;
}

// detectar sesión
export function onUserChange(callback) {
  onAuthStateChanged(auth, callback);
}