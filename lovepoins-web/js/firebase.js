import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// 🔥 CONFIG FIREBASE
const firebaseConfig = {

  apiKey: "AIzaSyBVnJdDkr4tw4dD9lr8APcsAiGF5y3VUEg",

  authDomain: "lovepoints-d0cc6.firebaseapp.com",

  projectId: "lovepoints-d0cc6",

  storageBucket: "lovepoints-d0cc6.firebasestorage.app",

  messagingSenderId: "844599014745",

  appId: "1:844599014745:web:ed1c32be41ccd45b140848"

};

// 🔥 INIT
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// =====================================
// 🔥 GUARDAR LOG
// =====================================

export async function saveLog(log){

  try{

    await addDoc(
      collection(db, "logs"),
      log
    );

    console.log(
      "✅ Log guardado"
    );

  }catch(e){

    console.error(
      "❌ Error saveLog:",
      e
    );

  }

}


// =====================================
// 🔥 REALTIME LOGS
// =====================================

export function listenLogs(

  coupleId,

  callback

){

  // 🔥 protección
  if(!coupleId){

    console.log(
      "⚠️ coupleId vacío"
    );

    callback([]);

    return;

  }

  const q = query(

    collection(db, "logs"),

    where(
      "coupleId",
      "==",
      coupleId
    )

  );

  onSnapshot(

    q,

    snapshot => {

      const logs =
        snapshot.docs.map(
          d => d.data()
        );

      callback(logs);

    },

    error => {

      console.error(
        "❌ Error realtime:",
        error
      );

    }

  );

}