// js/stats.js

// semana
export function getWeek(date) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${week}`;
}

// ganador semanal
export function getWeeklyWinner(logs) {
  const currentWeek = getWeek(new Date());

  let totals = { Hombre: 0, Mujer: 0 };

  logs.forEach(l => {
    if (l.week === currentWeek) {
      totals[l.user] += l.points;
    }
  });

  if (totals.Hombre === totals.Mujer) return "Empate";
  return totals.Hombre > totals.Mujer ? "Él" : "Ella";
}

// 🧠 QUIÉN HIZO MÁS ACCIONES (TOP)
export function getTopActions(logs) {
  const actions = {};

  logs.forEach(l => {
    if (!actions[l.action]) {
      actions[l.action] = { Hombre: 0, Mujer: 0 };
    }
    actions[l.action][l.user]++;
  });

  return actions;
}

// 📊 QUIÉN SUMÓ MÁS PUNTOS TOTAL
export function getTotalPoints(logs) {
  let totals = { Hombre: 0, Mujer: 0 };

  logs.forEach(l => {
    totals[l.user] += l.points;
  });

  return totals;
}