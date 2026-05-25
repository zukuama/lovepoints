// =====================================
// ❤️ COUPLES
// =====================================

import { db }

from "./firebase.js";

import {

  doc,
  setDoc,
  getDoc,
  updateDoc

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {

  updateUser

}

from "./users.js";


// =====================================
// 🔥 GENERAR CÓDIGO
// =====================================

function generateCode(){

  return Math.random()

  .toString(36)

  .substring(2,8)

  .toUpperCase();

}


// =====================================
// ❤️ CREAR PAREJA
// =====================================

export async function createCouple(uid){

  const code =
    generateCode();

  await setDoc(

    doc(
      db,
      "couples",
      code
    ),

    {

      code,

      createdBy:uid,

      createdAt:
        Date.now()

    }

  );

  await updateUser(uid,{

    coupleId:code

  });

  return code;

}


// =====================================
// 🔗 UNIRSE
// =====================================

export async function joinCouple(

  uid,

  code

){

  const ref =
    doc(
      db,
      "couples",
      code
    );

  const snap =
    await getDoc(ref);

  if(!snap.exists()){

    throw new Error(
      "Pareja no encontrada"
    );

  }

  await updateUser(uid,{

    coupleId:code

  });

}