// =====================================
// 👤 USERS
// =====================================

import { db }

from "./firebase.js";

import {

  doc,
  getDoc,
  updateDoc

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// =====================================
// 👀 GET USER
// =====================================

export async function getUserData(uid){

  const ref =
    doc(
      db,
      "users",
      uid
    );

  const snap =
    await getDoc(ref);

  if(snap.exists()){

    return snap.data();

  }

  return null;

}


// =====================================
// ❤️ UPDATE USER
// =====================================

export async function updateUser(

  uid,

  data

){

  const ref =
    doc(
      db,
      "users",
      uid
    );

  await updateDoc(
    ref,
    data
  );

}