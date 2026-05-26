// =====================================
// 🔥 ESTADÍSTICAS
// =====================================


// =====================================
// 📅 OBTENER DÍA
// =====================================

function getDayKey(timestamp){

  const d =
    new Date(timestamp);

  return `

    ${d.getFullYear()}-

    ${d.getMonth()+1}-

    ${d.getDate()}

  `;

}


// =====================================
// 🏆 DÍAS GANADOS
// =====================================

export function calculateDayWins(logs){

  const days = {};

  logs.forEach(log => {

    const day =
      getDayKey(
        log.timestamp
      );

    if(!days[day]){

      days[day] = {};

    }

    if(!days[day][log.userId]){

      days[day][log.userId] = 0;

    }

    days[day][log.userId] +=
      Number(log.points || 0);

  });

  const winners = {};

  Object.values(days).forEach(dayData => {

    const users =
      Object.entries(dayData);

    if(users.length < 2){

      return;

    }

    users.sort(
      (a,b)=>b[1]-a[1]
    );

    const winnerId =
      users[0][0];

    winners[winnerId] =
      (winners[winnerId] || 0)
      + 1;

  });

  return winners;

}


// =====================================
// ❤️ CONTAR ACCIONES
// =====================================

export function countActions(logs){

  const result = {};

  logs.forEach(log => {

    const action =
      log.action;

    if(!result[action]){

      result[action] = 0;

    }

    result[action]++;

  });

  return result;

}


// =====================================
// 🔥 ACCIÓN FAVORITA
// =====================================

export function favoriteAction(logs){

  const actions =
    countActions(logs);

  let winner = null;

  let max = 0;

  Object.entries(actions)
  .forEach(([name,count])=>{

    if(count > max){

      max = count;

      winner = name;

    }

  });

  return {

    name:winner,

    count:max

  };

}


// =====================================
// 🏆 USUARIO MÁS ACTIVO
// =====================================

export function mostActiveUser(logs){

  const users = {};

  logs.forEach(log => {

    if(!users[log.userName]){

      users[log.userName] = 0;

    }

    users[log.userName] +=
      Number(log.points || 0);

  });

  let winner = null;

  let max = 0;

  Object.entries(users)
  .forEach(([name,points])=>{

    if(points > max){

      max = points;

      winner = name;

    }

  });

  return {

    name:winner,

    points:max

  };

}


// =====================================
// 📊 STATS COMPLETAS
// =====================================

export function buildStats(logs){

  return {

    dayWins:
      calculateDayWins(logs),

    favorite:
      favoriteAction(logs),

    activeUser:
      mostActiveUser(logs),

    actions:
      countActions(logs)

  };

}