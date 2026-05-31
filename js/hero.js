// =====================================
// ❤️ HERO PREMIUM
// =====================================

export function updateHero({

  user,
  partner,
  logs = []

}){

  const hero =
    document.getElementById(
      "couple-hero"
    );

  if(!hero){

    return;

  }

  // =====================================
  // ❌ SIN PAREJA
  // =====================================

  if(!partner){

    hero.classList.add(
      "d-none"
    );

    return;

  }

  hero.classList.remove(
    "d-none"
  );

  // =====================================
  // ❤️ FOTO USUARIO
  // =====================================

  const userPhoto =
    document.getElementById(
      "hero-user-photo"
    );

  if(userPhoto){

    userPhoto.src =
      user?.photoURL || "";

  }

  // =====================================
  // ❤️ FOTO PAREJA
  // =====================================

  const partnerPhoto =
    document.getElementById(
      "hero-partner-photo"
    );

  if(partnerPhoto){

    partnerPhoto.src =
      partner?.photoURL || "";

  }

  // =====================================
  // ❤️ NOMBRES
  // =====================================

  const names =
    document.getElementById(
      "hero-names"
    );

  if(names){

    names.innerText =

      `${user?.name || "Tú"}
       ❤️
       ${partner?.name || "Pareja"}`;

  }

  // =====================================
  // 💋 ÚLTIMA ACCIÓN
  // =====================================

  const lastAction =
    document.getElementById(
      "hero-last-action"
    );

  if(lastAction){

    if(logs.length){

      const last =
        [...logs]
        .sort(
          (a,b)=>
          b.timestamp -
          a.timestamp
        )[0];

      lastAction.innerText =

        `${last.userName}
        •
        ${last.action}
        (+${last.points})`;

    }

    else{

      lastAction.innerText =
        "Sin actividad todavía ❤️";

    }

  }

  // =====================================
  // 🔥 PUNTOS DEL MES
  // =====================================

  const monthElement =
    document.getElementById(
      "hero-month"
    );

  if(monthElement){

    const now =
      new Date();

    let total = 0;

    logs.forEach(log => {

      const d =
        new Date(
          log.timestamp
        );

      if(

        d.getMonth()
        ===
        now.getMonth()

        &&

        d.getFullYear()
        ===
        now.getFullYear()

      ){

        total +=
          Number(
            log.points || 0
          );

      }

    });

    monthElement.innerText =

      `🔥 ${total}
      puntos este mes`;

  }

}