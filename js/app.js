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

import {
  renderUser,
  renderCoupleSection,
  renderNames
}
from "./ui.js";

import {

  createActivity,
  listenActivities,
  increaseActivityUse

}
from "./activities.js";


// =====================================
// 🔥 VARIABLES
// =====================================

let logs = [];

let activities = [];

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

    currentUserData.coupleId =
      code;

    renderCoupleSection(
      currentUserData
    );

    startRealtimeLogs();

    startRealtimeActivities();

    alert(
      "❤️ Pareja creada"
    );

  }catch(e){

    console.error(e);

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
    .getElementById(
      "join-code"
    )
    .value
    .trim()
    .toUpperCase();

  if(!code){

    alert(
      "Ingresá código"
    );

    return;

  }

  try{

    await joinCouple(

      currentUserData.uid,

      code

    );

    currentUserData.coupleId =
      code;

    renderCoupleSection(
      currentUserData
    );

    startRealtimeLogs();

    startRealtimeActivities();

    alert(
      "❤️ Vinculados"
    );

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

      const userData =
        await getUserData(
          user.uid
        );

      currentUserData = {

        ...user,

        ...userData

      };

      isAuthReady = true;

      renderUser(
        currentUserData
      );

      renderCoupleSection(
        currentUserData
      );

      startRealtimeLogs();

      startRealtimeActivities();

    }catch(e){

      console.error(e);

    }

  }else{

    currentUserData = null;

    isAuthReady = false;

    logs = [];

    activities = [];

    render();

    renderActivities();

    renderUser(null);

    renderCoupleSection(null);

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

    logs = [];

    render();

    return;

  }

  listenLogs(

    currentUserData.coupleId,

    realtimeLogs => {

      logs = realtimeLogs;

      render();

    }

  );

}


// =====================================
// 🔥 REALTIME ACTIVITIES
// =====================================

function startRealtimeActivities(){

  if(

    !currentUserData ||

    !currentUserData.coupleId

  ){

    activities = [];

    renderActivities();

    return;

  }

  listenActivities(

    currentUserData.coupleId,

    realtimeActivities => {

      activities =
        realtimeActivities;

      renderActivities();

    }

  );

}


// =====================================
// ➕ CREAR ACTIVIDAD
// =====================================

window.createNewActivity =
async function(){

  if(!currentUserData){

    alert(
      "Iniciá sesión"
    );

    return;

  }

  if(!currentUserData.coupleId){

    alert(
      "Primero conectá pareja"
    );

    return;

  }

  const name =
    document
    .getElementById(
      "activity-name"
    )
    .value
    .trim();

  const points =
    Number(

      document
      .getElementById(
        "activity-points"
      )
      .value

    );

  const file =
    document
    .getElementById(
      "activity-image"
    )
    .files[0];

  if(!name || !points){

    alert(
      "Completar datos"
    );

    return;

  }

  let image = "";

  // =====================================
  // 🔥 CONVERTIR IMAGEN BASE64
  // =====================================

  if(file){

    image =
      await toBase64(file);

  }

  const activity = {

    coupleId:
      currentUserData.coupleId,

    name,

    points,

    image,

    uses:0,

    createdBy:
      currentUserData.uid,

    createdAt:
      Date.now()

  };

  try{

    await createActivity(
      activity
    );

    // limpiar
    document
    .getElementById(
      "activity-name"
    )
    .value = "";

    document
    .getElementById(
      "activity-points"
    )
    .value = "";

    document
    .getElementById(
      "activity-image"
    )
    .value = "";

    document
    .getElementById(
      "activity-preview"
    )
    .style.display = "none";

  }catch(e){

    console.error(e);

  }

};


// =====================================
// 🔥 PREVIEW IMAGEN
// =====================================

document
.getElementById(
  "activity-image"
)
?.addEventListener(

  "change",

  async e => {

    const file =
      e.target.files[0];

    if(!file){

      return;

    }

    const base64 =
      await toBase64(file);

    const preview =
      document.getElementById(
        "activity-preview"
      );

    preview.src =
      base64;

    preview.style.display =
      "block";

  }

);


// =====================================
// 🔥 TO BASE64
// =====================================

function toBase64(file){

  return new Promise((resolve,reject)=>{

    const reader =
      new FileReader();

    reader.readAsDataURL(file);

    reader.onload =
      ()=>resolve(reader.result);

    reader.onerror =
      error=>reject(error);

  });

}


// =====================================
// ➕ AGREGAR PUNTOS
// =====================================

window.addPoint =
async function(

  activityId,
  action,
  points

){

  if(!isAuthReady){

    alert(
      "Iniciá sesión"
    );

    return;

  }

  if(!currentUserData.coupleId){

    alert(
      "Conectá pareja"
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
      currentUserData.gender,

    coupleId:
      currentUserData.coupleId,

    action,

    points,

    activityId,

    timestamp:
      now.getTime(),

    month:
      now.getMonth(),

    year:
      now.getFullYear()

  };

  try{

    await saveLog(log);

    // 🔥 sumar uso
    await increaseActivityUse(
      activityId
    );

  }catch(e){

    console.error(e);

  }

};


// =====================================
// 🎨 ACTIVIDADES
// =====================================

function renderActivities(){

  const container =
    document.getElementById(
      "activities-container"
    );

  if(!container){

    return;

  }

  container.innerHTML = "";

  activities.forEach(a=>{

    const col =
      document.createElement("div");

    col.className =
      "col-6";

    col.innerHTML = `

      <button
      class="btn btn-action w-100"

      style="
      background-image:url('${a.image || ""}');
      "

      onclick="
      addPoint(
        '${a.id}',
        '${a.name}',
        ${a.points}
      )
      "
      >

      <div class="btn-overlay"></div>

      <div class="badge-use">
      🔥 ${a.uses || 0}
      </div>

      <div class="btn-content">

      <div class="fs-5">
      ${a.name}
      </div>

      <small>
      +${a.points} pts
      </small>

      </div>

      </button>

    `;

    container.appendChild(col);

  });

}


// =====================================
// 🎨 SCORE + HISTORIAL
// =====================================

function render(){

  let hombreTotal = 0;

  let mujerTotal = 0;

  logs.forEach(l => {

    const pts =
      Number(l.points) || 0;

    const gender =
      String(l.gender || "")
      .toLowerCase()
      .trim();

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

  renderNames(logs);

  // =====================================
  // 🔥 SCORE
  // =====================================

  document.getElementById(
    "score-Hombre"
  ).innerText =
    hombreTotal;

  document.getElementById(
    "score-Mujer"
  ).innerText =
    mujerTotal;

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