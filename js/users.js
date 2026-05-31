// =====================================
// 👤 USERS
// =====================================

import { db }

from "./firebase.js";

import {

  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs

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

// =====================================
// ❤️ GET PARTNER
// =====================================

export async function getPartnerData(

  myUid,

  coupleId

){

  if(!coupleId){

    return null;

  }

  const q = query(

    collection(
      db,
      "users"
    ),

    where(
      "coupleId",
      "==",
      coupleId
    )

  );

  const snap =
    await getDocs(q);

  let partner = null;

  snap.forEach(docSnap => {

    if(
      docSnap.id !== myUid
    ){

      partner =
        docSnap.data();

    }

  });

  return partner;

}