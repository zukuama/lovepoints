import { saveLog, getLogs } from "./firebase.js";
import { loginGoogle, onUserChange } from "./auth.js";

let currentUser = "Hombre";
let logs = [];
let currentUserData = null;
let isAuthReady = false;

// 🔐 login
window.login = async function() {
  await loginGoogle();
};

// 👀 esperar usuario
onUserChange(user => {
  if (user) {
    currentUserData = user;
    document.getElementById("user-name").innerText = user.displayName;
    isAuthReady = true;
    console.log("✅ Usuario listo:", user.displayName);
  } else {
    currentUserData = null;
    isAuthReady = false;
  }
});

// cambiar usuario visual
window.setUser = function(user) {
  currentUser = user;
  render();
};

// ➕ sumar puntos
window.addPoint = async function(action, points) {

  // 🔥 PROTECCIÓN REAL
  if (!isAuthReady || !currentUserData) {
    alert("⚠️ Tenés que iniciar sesión primero");
    return;
  }

  const now = new Date();

  const log = {
    userId: currentUserData.uid,
    userName: currentUserData.displayName,
    gender: currentUser,
    action,
    points,
    timestamp: now.getTime(),
    month: now.getMonth(),
    year: now.getFullYear()
  };

  try {
    await saveLog(log);
    logs.push(log);
    render();
  } catch (e) {
    console.error("🔥 Error real:", e);
  }
};

// 🎨 render
function render() {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  let totals = { Hombre: 0, Mujer: 0 };

  logs.forEach(l => {
    if (l.month === month && l.year === year) {
      totals[l.gender] += l.points;
    }
  });

  document.getElementById("score-Hombre").innerText = totals.Hombre;
  document.getElementById("score-Mujer").innerText = totals.Mujer;

  const list = document.getElementById("history-list");
  list.innerHTML = "";

  logs.slice(-5).reverse().forEach(l => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `${l.userName} hizo ${l.action} (+${l.points})`;
    list.appendChild(div);
  });
}

// init
async function init() {
  logs = await getLogs();
  render();
}

init();