// =====================================
// 🗑️ ELIMINAR ACTIVIDAD
// =====================================

import { db }

from "./firebase.js";

import {

  doc,
  deleteDoc

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// =====================================
// 🗑️ BORRAR ACTIVIDAD
// =====================================

export async function deleteActivity(

  activityId

){

  try{

    await deleteDoc(

      doc(
        db,
        "activities",
        activityId
      )

    );

    return true;

  }

  catch(error){

    console.error(
      error
    );

    return false;

  }

}