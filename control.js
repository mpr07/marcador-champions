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
  const regex = /^(\d{1,2}):(\d{2})$/;

  if (regex.test(valor)) {
    const [_, min, seg] = valor.match(regex);
    minuts = parseInt(min);
    segons = parseInt(seg);

    const format = `${minuts.toString().padStart(2, '0')}:${segons.toString().padStart(2, '0')}`;
    db.ref('marcador').update({ temps: format });
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

function aplicarColors(banda) {
  const prefix = banda === 'esquerra' ? 'color1' : 'color2';
  const colorA = document.getElementById(`${prefix}a`).value.trim();
  const colorB = document.getElementById(`${prefix}b`).value.trim();

  if (!colorA) {
    alert("Introdueix com a mínim un color en format hexadecimal.");
    return;
  }

  const colors = colorB ? [colorA, colorB] : [colorA];
  db.ref(`marcador/colors/${banda}`).set(colors);

  function ajustarSegons(delta) {
  // Calcula el nou temps a partir de les variables locals
  let total = minuts * 60 + segons + delta;
  if (total < 0) total = 0;

  minuts = Math.floor(total / 60);
  segons = total % 60;

  const format = `${minuts.toString().padStart(2, '0')}:${segons.toString().padStart(2, '0')}`;
  db.ref('marcador').update({ temps: format });
}
}