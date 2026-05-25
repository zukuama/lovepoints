import {
  saveLog,
  listenLogs
}
from "./firebase.js";

import {
  loginGoogle,
  onUserChange,
  logout
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


// =====================================
// 🔥 VARIABLES
// =====================================

let logs = [];

let currentUserData = null;

let isAuthReady = false;


// =====================================
// 🔐 LOGIN
// =====================================

window.login = async function(){

  try{

    await loginGoogle();

  }catch(e){

    console.error(e);

    alert(
      "Error iniciando sesión"
    );

  }

};


// =====================================
// 🚪 LOGOUT
// =====================================

window.logout = async function(){

  try{

    await logout();

    alert(
      "Sesión cerrada"
    );

    location.reload();

  }catch(e){

    console.error(e);

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

    // 🔥 guardar local
    currentUserData.coupleId =
      code;

    // 🔥 UI
    const coupleCodeEl =
      document.getElementById(
        "couple-code"
      );

    if(coupleCodeEl){

      coupleCodeEl.innerText = code;

    }

    // 🔥 realtime
    startRealtimeLogs();

    alert(
      "❤️ Pareja creada"
    );

  }catch(e){

    console.error(e);

    alert(
      "Error creando pareja"
    );

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

  const input =
    document.getElementById(
      "join-code"
    );

  if(!input){

    alert(
      "No existe el input join-code"
    );

    return;

  }

  const code =
    input.value
    .trim()
    .toUpperCase();

  if(!code){

    alert(
      "Ingresá un código"
    );

    return;

  }

  try{

    await joinCouple(

      currentUserData.uid,

      code

    );

    // 🔥 actualizar local
    currentUserData.coupleId =
      code;

    // 🔥 realtime
    startRealtimeLogs();

    alert(
      "❤️ Vinculados"
    );

  }catch(e){

    console.error(e);

    alert(
      e.message
    );

  }

};


// =====================================
// 👀 SESIÓN
// =====================================

onUserChange(async user => {

  if(user){

    try{

      const userData =
        await getUserData(
          user.uid
        );

      currentUserData = {

        ...user,

        ...userData

      };

      isAuthReady = true;

      console.log(
        "✅ Usuario:",
        currentUserData
      );

      // 🔥 nombre UI
      const userName =
        document.getElementById(
          "user-name"
        );

      if(userName){

        userName.innerText =

          currentUserData.name ||

          user.displayName;

      }

      // 🔥 realtime
      startRealtimeLogs();

    }catch(e){

      console.error(e);

    }

  }else{

    currentUserData = null;

    isAuthReady = false;

    logs = [];

    render();

  }

});


// =====================================
// 🔥 REALTIME LOGS
// =====================================

function startRealtimeLogs(){

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

      console.table(logs);

      render();

    }

  );

}


// =====================================
// ➕ AGREGAR PUNTOS
// =====================================

window.addPoint =
async function(action, points){

  if(!isAuthReady){

    alert(
      "Iniciá sesión"
    );

    return;

  }

  if(!currentUserData){

    alert(
      "Usuario inválido"
    );

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
      currentUserData.name
      || "Usuario",

    gender:
      currentUserData.gender
      || "Hombre",

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

  console.log(
    "🔥 Guardando log:",
    log
  );

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

  let hombreTotal = 0;

  let mujerTotal = 0;

  // 🔥 recorrer logs
  logs.forEach(l => {

    // 🔥 validar puntos
    const pts =
      Number(l.points) || 0;

    // 🔥 normalizar gender
    const gender =
      String(l.gender || "")
      .toLowerCase()
      .trim();

    // 🔥 sumar
    if(

      gender.includes("hombre") ||

      gender.includes("male") ||

      gender.includes("mascul")

    ){

      hombreTotal += pts;

    }

    else if(

      gender.includes("mujer") ||

      gender.includes("female") ||

      gender.includes("femen")

    ){

      mujerTotal += pts;

    }

  });

  console.log(
    "🔥 Hombre:",
    hombreTotal
  );

  console.log(
    "🔥 Mujer:",
    mujerTotal
  );

  // 🔥 UI
  const scoreHombre =
    document.getElementById(
      "score-Hombre"
    );

  const scoreMujer =
    document.getElementById(
      "score-Mujer"
    );

  if(scoreHombre){

    scoreHombre.innerText =
      hombreTotal;

  }

  if(scoreMujer){

    scoreMujer.innerText =
      mujerTotal;

  }

  // =====================================
  // 🔥 HISTORIAL
  // =====================================

  const list =
    document.getElementById(
      "history-list"
    );

  if(!list){

    return;

  }

  list.innerHTML = "";

  logs
  .sort(
    (a,b)=>
    b.timestamp - a.timestamp
  )
  .slice(0,20)
  .forEach(l => {

    const div =
      document.createElement("div");

    div.className =
      "history-item";

    div.innerHTML = `

      <strong>
        ${l.userName}
      </strong>

      hizo

      ${l.action}

      (+${l.points})

    `;

    list.appendChild(div);

  });

}