let minuts = 0;
let segons = 0;
let intervalId = null;

// Funció interna per formatar el temps a "MM:SS"
function formatarTemps(m, s) {
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function iniciarTemps() {
  if (intervalId) {
    console.log("El rellotge ja estava en marxa.");
    return; 
  }

  console.log("Iniciant cronòmetre...");

  db.ref('marcador/temps').once('value').then(snapshot => {
    const valor = snapshot.val() || "00:00";
    const parts = valor.split(':');
    
    if (parts.length === 2) {
      minuts = parseInt(parts[0]);
      segons = parseInt(parts[1]);
      
      console.log(`Temps sincronitzat: ${minuts}:${segons}`);

      // Usem setInterval i ens assegurem que la variable intervalId es guardi bé
      intervalId = setInterval(() => {
        segons++;
        if (segons >= 60) {
          segons = 0;
          minuts++;
          console.log("Canvi de minut detectat...");
        }

        const format = formatarTemps(minuts, segons);
        
        // Enviem a Firebase i capturem si hi ha errors
        db.ref('marcador').update({ temps: format })
          .catch(err => console.error("Error actualitzant Firebase:", err));

      }, 1000);
    }
  }).catch(err => console.error("Error llegint de Firebase:", err));
}

function pausarTemps() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function aplicarTempsManual() {
  const valor = document.getElementById('tempsManual').value;
  const regex = /^(\d{1,2}):(\d{2})$/;

  if (regex.test(valor)) {
    const [_, min, seg] = valor.match(regex);
    minuts = parseInt(min);
    segons = parseInt(seg);

    const format = formatarTemps(minuts, segons);
    db.ref('marcador').update({ temps: format });
  } else {
    alert("Format incorrecte. Usa HH:MM (ex: 45:00)");
  }
}

function ajustarSegons(delta) {
  // Calculem el total actual en segons
  let total = (minuts * 60) + segons + delta;
  if (total < 0) total = 0;

  minuts = Math.floor(total / 60);
  segons = total % 60;

  const format = formatarTemps(minuts, segons);
  db.ref('marcador').update({ temps: format });
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
  pausarTemps();
  minuts = 0;
  segons = 0;

  db.ref('marcador').update({
    temps: "00:00",
    gols1: 0,
    gols2: 0,
    mode: 'text' // Tornem a mode text per defecte
  });
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
    alert("Introdueix com a mínim un color.");
    return;
  }

  const colors = colorB ? [colorA, colorB] : [colorA];
  db.ref(`marcador/colors/${banda}`).set(colors);
}

function activarEscuts() {
  db.ref('marcador').update({ mode: 'escut' });
}

function activarNoms() {
  db.ref('marcador').update({ mode: 'text' });
}