export function getWeeklyWinner(logs){

  const now = new Date();

  const startOfWeek = new Date(now);

  startOfWeek.setDate(
    now.getDate() - now.getDay()
  );

  startOfWeek.setHours(
    0,0,0,0
  );

  const weeklyLogs =
    logs.filter(log =>

      log.timestamp >=
      startOfWeek.getTime()

    );

  const scores = {};

  weeklyLogs.forEach(log => {

    if(!scores[log.userName]){

      scores[log.userName] = 0;

    }

    scores[log.userName] +=
      Number(log.points || 0);

  });

  const ranking =
    Object.entries(scores)
    .sort(
      (a,b)=>
      b[1]-a[1]
    );

  if(ranking.length === 0){

    return null;

  }

  return {

    winner:
      ranking[0][0],

    points:
      ranking[0][1],

    ranking

  };

}