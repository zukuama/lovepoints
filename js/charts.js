// =====================================
// 📊 CHARTS
// =====================================

let pointsChart = null;


// =====================================
// 📈 CHART PUNTOS
// =====================================

export function renderPointsChart(logs){

  const canvas =
    document.getElementById(
      "pointsChart"
    );

  if(!canvas){

    return;

  }

  const ctx =
    canvas.getContext("2d");

  // destruir chart anterior
  if(pointsChart){

    pointsChart.destroy();

  }

  // =====================================
  // 🔥 AGRUPAR POR DÍA
  // =====================================

  const days = {};

  logs.forEach(log => {

    const d =
      new Date(log.timestamp);

    const key =

      `${d.getDate()}/${
        d.getMonth()+1
      }`;

    if(!days[key]){

      days[key] = {

        Hombre:0,
        Mujer:0

      };

    }

    const gender =
      String(
        log.gender || ""
      )
      .toLowerCase();

    if(

      gender.includes("hombre")

    ){

      days[key].Hombre +=
        Number(log.points || 0);

    }

    else{

      days[key].Mujer +=
        Number(log.points || 0);

    }

  });

  const labels =
    Object.keys(days);

  const hombreData =
    labels.map(
      d => days[d].Hombre
    );

  const mujerData =
    labels.map(
      d => days[d].Mujer
    );

  // =====================================
  // 🚀 CREAR CHART
  // =====================================

  pointsChart =
    new Chart(ctx, {

      type:"line",

      data:{

        labels,

        datasets:[

          {

            label:"Él",

            data:hombreData,

            tension:.3

          },

          {

            label:"Ella",

            data:mujerData,

            tension:.3

          }

        ]

      },

      options:{

        responsive:true,

        plugins:{

          legend:{

            display:true

          }

        }

      }

    });

}