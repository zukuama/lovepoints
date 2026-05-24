import {
  saveLog,
  listenLogs
}
from "./firebase.js";

import {
  loginGoogle,
  onUserChange
}
from "./auth.js";

import {
  getUserData
}
from "./users.js";

import {
  createCouple,
  joinCouple
}
from "./couples.js";

// 🔥 logs realtime
let logs = [];

// 🔥 usuario actual
let currentUserData = null;

// 🔥 auth lista
let isAuthReady = false;


// =====================================
// 🔐 LOGIN
// =====================================

window.login = async function(){

  try{

    await loginGoogle();

  }catch(e){

    console.error(e);

    alert("Error iniciando sesión");

  }

};


// =====================================
// ❤️ CREAR PAREJA
// =====================================

window.createMyCouple =
async function(){

  if(!currentUserData){

    alert("Iniciá sesión");

    return;

  }

  try{

    const code =
      await createCouple(
        currentUserData.uid
      );

    // 🔥 guardar localmente
    currentUserData.coupleId = code;

    // 🔥 actualizar UI
    document.getElementById(
      "couple-code"
    ).innerText = code;

    // 🔥 iniciar realtime
    startRealtimeLogs();

    alert("❤️ Pareja creada");

  }catch(e){

    console.error(e);

    alert("Error creando pareja");

  }

};


// =====================================
// 🔗 UNIRSE A PAREJA
// =====================================

window.joinMyCouple =
async function(){

  if(!currentUserData){

    alert("Iniciá sesión");

    return;

  }

  const code =
    document
    .getElementById("join-code")
    .value
    .toUpperCase();

  if(!code){

    alert("Ingresá un código");

    return;

  }

  try{

    await joinCouple(
      currentUserData.uid,
      code
    );

    // 🔥 guardar local
    currentUserData.coupleId = code;

    // 🔥 iniciar realtime
    startRealtimeLogs();

    alert("❤️ Vinculados");

  }catch(e){

    console.error(e);

    alert(e.message);

  }

};


// =====================================
// 👀 SESIÓN
// =====================================

onUserChange(async user => {

  if(user){

    try{

      // 🔥 traer datos firestore
      const userData =
        await getUserData(user.uid);

      currentUserData = {

        ...user,
        ...userData

      };

      isAuthReady = true;

      // 🔥 nombre UI
      document.getElementById(
        "user-name"
      ).innerText =
        currentUserData.name ||
        user.displayName;

      console.log(
        "✅ Usuario:",
        currentUserData
      );

      // 🔥 realtime
      startRealtimeLogs();

    }catch(e){

      console.error(e);

    }

  }else{

    currentUserData = null;

    isAuthReady = false;

  }

});


// =====================================
// 🔥 REALTIME LOGS
// =====================================

function startRealtimeLogs(){

  // 🔥 protección
  if(
    !currentUserData ||
    !currentUserData.coupleId
  ){

    console.log(
      "⚠️ Usuario sin pareja"
    );

    logs = [];

    render();

    return;

  }

  console.log(
    "❤️ Escuchando pareja:",
    currentUserData.coupleId
  );

  listenLogs(

    currentUserData.coupleId,

    realtimeLogs => {

      logs = realtimeLogs;

      console.log(
        "🔥 Logs realtime:",
        logs
      );

      render();

    }

  );

}


// =====================================
// ➕ SUMAR PUNTOS
// =====================================

window.addPoint =
async function(action, points){

  if(!isAuthReady){

    alert("Iniciá sesión");

    return;

  }

  if(!currentUserData.coupleId){

    alert(
      "Primero creá o uníte a una pareja ❤️"
    );

    return;

  }

  const now = new Date();

  const log = {

    userId:
      currentUserData.uid,

    userName:
      currentUserData.name,

    gender:
      currentUserData.gender || "Hombre",

    coupleId:
      currentUserData.coupleId,

    action,

    points,

    timestamp:
      now.getTime(),

    month:
      now.getMonth(),

    year:
      now.getFullYear()

  };

  try{

    await saveLog(log);

    console.log(
      "✅ Punto agregado"
    );

  }catch(e){

    console.error(e);

    alert(
      "Error guardando puntos"
    );

  }

};


// =====================================
// 🎨 RENDER
// =====================================

function render(){

  const month =
    new Date().getMonth();

  const year =
    new Date().getFullYear();

  let totals = {

    Hombre:0,
    Mujer:0

  };

  logs.forEach(l => {

    if(
      l.month === month &&
      l.year === year
    ){

      if(!totals[l.gender]){

        totals[l.gender] = 0;

      }

      totals[l.gender] += l.points;

    }

  });

  // 🔥 scores
  document.getElementById(
    "score-Hombre"
  ).innerText =
    totals.Hombre || 0;

  document.getElementById(
    "score-Mujer"
  ).innerText =
    totals.Mujer || 0;

  // 🔥 historial
  const list =
    document.getElementById(
      "history-list"
    );

  list.innerHTML = "";

  logs
  .sort(
    (a,b)=>
    b.timestamp - a.timestamp
  )
  .slice(0,10)
  .forEach(l => {

    const div =
      document.createElement("div");

    div.className =
      "history-item";

    div.innerHTML = `
      <strong>${l.userName}</strong>
      hizo
      ${l.action}
      (+${l.points})
    `;

    list.appendChild(div);

  });

}