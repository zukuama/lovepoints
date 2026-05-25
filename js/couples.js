import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

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

export async function createCouple(userId){

  const code = generateCode();

  // 🔥 crear pareja
  await setDoc(

    doc(db, "couples", code),

    {

      code,

      members:[userId],

      createdAt:Date.now()

    }

  );

  // 🔥 actualizar usuario
  await updateDoc(

    doc(db, "users", userId),

    {

      coupleId:code

    }

  );

  return code;

}


// =====================================
// 🔗 UNIRSE
// =====================================

export async function joinCouple(

  userId,

  code

){

  const ref =
    doc(db, "couples", code);

  const snap =
    await getDoc(ref);

  if(!snap.exists()){

    throw new Error(
      "Código inválido"
    );

  }

  const data = snap.data();

  // 🔥 evitar duplicados
  let members = data.members || [];

  if(!members.includes(userId)){

    members.push(userId);

  }

  // 🔥 actualizar pareja
  await updateDoc(ref, {

    members

  });

  // 🔥 actualizar usuario
  await updateDoc(

    doc(db, "users", userId),

    {

      coupleId:code

    }

  );

  return true;

}