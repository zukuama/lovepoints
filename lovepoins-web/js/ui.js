// js/ui.js

import { getWeeklyWinner, getTopActions, getTotalPoints } from "./stats.js";

export function renderUI(logs, currentUser) {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  let totals = { Hombre: 0, Mujer: 0 };

  logs.forEach(l => {
    if (l.month === month && l.year === year) {
      totals[l.user] += l.points;
    }
  });

  document.getElementById("score-Hombre").innerText = totals.Hombre;
  document.getElementById("score-Mujer").innerText = totals.Mujer;

  // 🏆 ganador
  document.getElementById("winner").innerText = getWeeklyWinner(logs);

  // historial
  const list = document.getElementById("history-list");
  list.innerHTML = "";

  logs.slice(-5).reverse().forEach(l => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `${l.user} hizo ${l.action} (+${l.points})`;
    list.appendChild(div);
  });

  // 🔥 ESTADÍSTICAS
  renderStats(logs);
}

function renderStats(logs) {
  const container = document.getElementById("stats");

  const totals = getTotalPoints(logs);
  const actions = getTopActions(logs);

  let html = `
    <div class="card p-3 mt-3">
      <h6>📊 Estadísticas</h6>
      <p><strong>Total Él:</strong> ${totals.Hombre}</p>
      <p><strong>Total Ella:</strong> ${totals.Mujer}</p>
      <hr>
      <strong>Acciones:</strong>
  `;

  for (let action in actions) {
    html += `
      <p>${action} → Él: ${actions[action].Hombre} | Ella: ${actions[action].Mujer}</p>
    `;
  }

  html += `</div>`;

  container.innerHTML = html;
}