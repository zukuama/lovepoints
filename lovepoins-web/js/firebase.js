import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVnJdDkr4tw4dD9lr8APcsAiGF5y3VUEg",
  authDomain: "lovepoints-d0cc6.firebaseapp.com",
  projectId: "lovepoints-d0cc6",
  storageBucket: "lovepoints-d0cc6.firebasestorage.app",
  messagingSenderId: "844599014745",
  appId: "1:844599014745:web:ed1c32be41ccd45b140848"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// guardar log
export async function saveLog(log) {
  await addDoc(collection(db, "logs"), log);
  console.log("✅ Guardado");
}

// obtener logs
export async function getLogs() {
  const snap = await getDocs(collection(db, "logs"));
  return snap.docs.map(d => d.data());
}