let minuts = 0;
let segons = 0;
let intervalId = null;

function actualitzarTemps() {
  segons++;
  if (segons >= 60) {
    segons = 0;
    minuts++;
  }
  const format = `${minuts.toString().padStart(2, '0')}:${segons.toString().padStart(2, '0')}`;
  db.ref('marcador').update({ temps: format });
}

function iniciarTemps() {
  if (intervalId) return; // Ja està en marxa

  // Obtenim el temps actual del marcador
  db.ref('marcador/temps').once('value').then(snapshot => {
    const valor = snapshot.val();
    const regex = /^(\d{1,2}):(\d{2})$/;

    if (regex.test(valor)) {
      const [_, min, seg] = valor.match(regex);
      minuts = parseInt(min);
      segons = parseInt(seg);

      intervalId = setInterval(() => {
        segons++;
        if (segons >= 60) {
          segons = 0;
          minuts++;
        }
        const format = `${minuts.toString().padStart(2, '0')}:${segons.toString().padStart(2, '0')}`;
        db.ref('marcador').update({ temps: format });
      }, 1000);
    } else {
      alert("El format del temps no és vàlid.");
    }
  });
}

function pausarTemps() {
  clearInterval(intervalId);
  intervalId = null;
}

function sumarGol(equip) {
  db.ref(`marcador/${equip}`).once('value').then(snapshot => {
    const valor = snapshot.val() || 0;
    db.ref('marcador').update({ [equip]: valor + 1 });
  });
}

function restarGol(equip) {
  db.ref(`marcador/${equip}`).once('value').then(snapshot => {
    const valor = snapshot.val() || 0;
    if (valor > 0) db.ref('marcador').update({ [equip]: valor - 1 });
  });
}

function reiniciarMarcador() {
  minuts = 0;
  segons = 0;
  clearInterval(intervalId);
  intervalId = null;

  db.ref('marcador').set({
    temps: "00:00",
    equip1: "BRU",
    equip2: "BAR",
    gols1: 0,
    gols2: 0
  });
}

function aplicarTempsManual() {
  const valor = document.getElementById('tempsManual').value;
  const regex = /^\d{1,2}:\d{2}$/;

  if (regex.test(valor)) {
    db.ref('marcador').update({ temps: valor });
  } else {
    alert("Format incorrecte. Usa HH:MM (ex: 45:00)");
  }
}

function canviarNom(equip) {
  const inputId = equip === 'equip1' ? 'nomEquip1' : 'nomEquip2';
  const nouNom = document.getElementById(inputId).value.trim();

  if (nouNom.length > 0) {
    db.ref('marcador').update({ [equip]: nouNom });
  } else {
    alert("Introdueix un nom vàlid.");
  }
}