// =====================================
// 🔥 FIREBASE
// =====================================

import { initializeApp }

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// =====================================
// ❤️ CONFIG REAL
// =====================================

const firebaseConfig = {

  apiKey:
  "AIzaSyBVnJdDkr4tw4dD9lr8APcsAiGF5y3VUEg",

  authDomain:
  "lovepoints-d0cc6.firebaseapp.com",

  projectId:
  "lovepoints-d0cc6",

  storageBucket:
  "lovepoints-d0cc6.firebasestorage.app",

  messagingSenderId:
  "844599014745",

  appId:
  "1:844599014745:web:ed1c32be41ccd45b140848",

  measurementId:
  "G-F0YMBN1ERV"

};


// =====================================
// 🚀 INIT
// =====================================

const app =
  initializeApp(
    firebaseConfig
  );


// =====================================
// 🔥 EXPORTS
// =====================================

export const db =
  getFirestore(app);


// =====================================
// ❤️ SAVE LOG
// =====================================

export async function saveLog(log){

  await addDoc(

    collection(
      db,
      "logs"
    ),

    log

  );

}


// =====================================
// 👀 REALTIME LOGS
// =====================================

export function listenLogs(

  coupleId,

  callback

){

  const q = query(

    collection(
      db,
      "logs"
    ),

    where(
      "coupleId",
      "==",
      coupleId
    ),

    orderBy(
      "timestamp",
      "desc"
    )

  );

  onSnapshot(

    q,

    snapshot=>{

      const logs =
        snapshot.docs.map(doc=>({

          id:doc.id,

          ...doc.data()

        }));

      callback(logs);

    }

  );

}