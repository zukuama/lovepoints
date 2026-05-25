import {

  db

}
from "./firebase.js";

import {

  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  increment

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// =====================================
// ❤️ CREAR ACTIVIDAD
// =====================================

export async function createActivity(activity){

  await addDoc(

    collection(db,"activities"),

    activity

  );

}


// =====================================
// 👀 ESCUCHAR ACTIVIDADES
// =====================================

export function listenActivities(

  coupleId,

  callback

){

  const q = query(

    collection(db,"activities"),

    where(
      "coupleId",
      "==",
      coupleId
    ),

    orderBy(
      "uses",
      "desc"
    )

  );

  onSnapshot(q,snapshot=>{

    const activities =
      snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

      }));

    callback(activities);

  });

}


// =====================================
// 🔥 SUMAR USO
// =====================================

export async function increaseActivityUse(

  activityId

){

  const ref =
    doc(
      db,
      "activities",
      activityId
    );

  await updateDoc(ref,{

    uses:increment(1)

  });

}