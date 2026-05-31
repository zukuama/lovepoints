// =====================================
// 👤 PERFIL USUARIO
// =====================================

export function renderUser(user){

  const loginBtn =
    document.getElementById(
      "login-btn"
    );

  const logoutBtn =
    document.getElementById(
      "logout-btn"
    );

  const profileBox =
    document.getElementById(
      "profile-box"
    );

  const profileImg =
    document.getElementById(
      "profile-img"
    );

  const profileName =
    document.getElementById(
      "profile-name"
    );

  if(user){

    // ocultar login
    loginBtn.style.display =
      "none";

    // mostrar perfil
    profileBox.style.display =
      "flex";

    logoutBtn.style.display =
      "block";

    profileImg.src =
      user.photo ||
      user.photoURL;

    profileName.innerText =
      user.name ||
      user.displayName;

  }else{

    loginBtn.style.display =
      "block";

    profileBox.style.display =
      "none";

    logoutBtn.style.display =
      "none";

  }

}


// =====================================
// ❤️ PANEL PAREJA
// =====================================

export function renderCoupleSection(

  user,
  partner = null

){

  // =====================================
  // 📦 CONTENEDORES HTML
  // =====================================

  const section =
    document.getElementById(
      "couple-section"
    );

  const connected =
    document.getElementById(
      "connected-box"
    );

  const partnerName =
    document.getElementById(
      "partner-name"
    );

  const partnerPhoto =
    document.getElementById(
      "partner-photo"
    );

  // =====================================
  // ❤️ USUARIO TIENE PAREJA
  // =====================================

  if(

    user &&
    user.coupleId

  ){

    // ocultar panel crear/unirse
    section.style.display =
      "none";

    // mostrar panel conectado
    connected.style.display =
      "block";

    // =====================================
    // 📸 FOTO PAREJA
    // =====================================

    if(

      partnerPhoto

    ){

      partnerPhoto.src =

        partner?.photoURL ||

        partner?.photo ||

        user.photoURL ||

        "";

    }

    // =====================================
    // 👤 NOMBRE PAREJA
    // =====================================

    if(

      partnerName

    ){

      partnerName.innerText =

        partner?.name ||

        partner?.displayName ||

        "❤️ Pareja conectada";

    }

  }

  // =====================================
  // 💔 SIN PAREJA
  // =====================================

  else{

    section.style.display =
      "block";

    connected.style.display =
      "none";

  }

}


// =====================================
// 🏆 NOMBRES SCORE
// =====================================

export function renderNames(logs){

  let hombre =
    "Él";

  let mujer =
    "Ella";

  logs.forEach(l => {

    const gender =
      String(l.gender || "")
      .toLowerCase();

    if(
      gender.includes("hombre")
    ){

      hombre =
        l.userName;

    }

    if(
      gender.includes("mujer")
    ){

      mujer =
        l.userName;

    }

  });

  const h =
    document.getElementById(
      "name-hombre"
    );

  const m =
    document.getElementById(
      "name-mujer"
    );

  if(h){

    h.innerText = hombre;

  }

  if(m){

    m.innerText = mujer;

  }

}