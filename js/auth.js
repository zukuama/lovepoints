// =====================================
// 🔐 AUTH
// =====================================

import {

  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import { db }

from "./firebase.js";

import {

  doc,
  getDoc,
  setDoc

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// =====================================
// 🔥 AUTH
// =====================================

const auth =
  getAuth();

const provider =
  new GoogleAuthProvider();


// =====================================
// 🔐 LOGIN
// =====================================

export async function loginGoogle(){

  const result =
    await signInWithPopup(
      auth,
      provider
    );

  const user =
    result.user;

  const ref =
    doc(
      db,
      "users",
      user.uid
    );

  const snap =
    await getDoc(ref);

  // =====================================
  // ❤️ CREAR USER
  // =====================================

  if(!snap.exists()){

    const gender =
      prompt(
        "¿Sos Hombre o Mujer?"
      ) || "Hombre";

    await setDoc(ref,{

      uid:user.uid,

      name:
        user.displayName,

      email:
        user.email,

      photo:
        user.photoURL,

      gender,

      coupleId:null,

      createdAt:
        Date.now()

    });

  }

  return user;

}


// =====================================
// 👀 CAMBIOS LOGIN
// =====================================

export function onUserChange(callback){

  onAuthStateChanged(

    auth,

    user=>{

      callback(user);

    }

  );

}


// =====================================
// 🚪 LOGOUT
// =====================================

export async function logout(){

  await signOut(auth);

}