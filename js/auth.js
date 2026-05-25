import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// =====================================
// 🔥 CONFIG FIREBASE
// =====================================

const firebaseConfig = {

  apiKey: "AIzaSyBVnJdDkr4tw4dD9lr8APcsAiGF5y3VUEg",

  authDomain: "lovepoints-d0cc6.firebaseapp.com",

  projectId: "lovepoints-d0cc6",

  storageBucket: "lovepoints-d0cc6.firebasestorage.app",

  messagingSenderId: "844599014745",

  appId: "1:844599014745:web:ed1c32be41ccd45b140848"

};


// =====================================
// 🔥 INIT
// =====================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// =====================================
// 🔥 GOOGLE PROVIDER
// =====================================

const provider = new GoogleAuthProvider();

// 🔥 FORZAR SELECCIÓN DE CUENTA
provider.setCustomParameters({

  prompt:"select_account"

});


// =====================================
// 🔐 LOGIN GOOGLE
// =====================================

export async function loginGoogle(){

  const result =
    await signInWithPopup(
      auth,
      provider
    );

  const user = result.user;

  const userRef =
    doc(db, "users", user.uid);

  const snap =
    await getDoc(userRef);

  // 🔥 SI NO EXISTE → CREAR
  if(!snap.exists()){

    const gender = prompt(
      "Ingresá tu género: Hombre o Mujer"
    );

    await setDoc(userRef, {

      uid:user.uid,

      name:user.displayName,

      email:user.email,

      photo:user.photoURL,

      gender,

      coupleId:null

    });

  }

  return user;

}


// =====================================
// 👀 DETECTAR SESIÓN
// =====================================

export function onUserChange(callback){

  onAuthStateChanged(

    auth,

    callback

  );

}


// =====================================
// 🚪 LOGOUT
// =====================================

export async function logout(){

  await signOut(auth);

}