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
  document.getElementById('temps').textContent = format;
}

function iniciarTemps() {
  if (!intervalId) {
    intervalId = setInterval(actualitzarTemps, 1000);
  }
}

function pausarTemps() {
  clearInterval(intervalId);
  intervalId = null;
}

function sumarGol(equip) {
  const marcador = document.getElementById(`gols${equip}`);
  marcador.textContent = parseInt(marcador.textContent) + 1;
}

function restarGol(equip) {
  const marcador = document.getElementById(`gols${equip}`);
  let valor = parseInt(marcador.textContent);
  if (valor > 0) {
    marcador.textContent = valor - 1;
  }
}

db.ref('marcador').on('value', snapshot => {
  const data = snapshot.val();
  document.getElementById('temps').textContent = data.temps;
  document.getElementById('gols1').textContent = data.gols1;
  document.getElementById('gols2').textContent = data.gols2;
  document.getElementById('equip1').textContent = data.equip1;
  document.getElementById('equip2').textContent = data.equip2;
  const colors = data.colors || {};

['esquerra', 'dreta'].forEach(banda => {
  const franja = document.getElementById(`franja-${banda}`);
  const quadre = document.getElementById(`color-box-${banda}`);
  const valors = colors[banda];

  if (valors && valors.length === 1) {
    franja.style.background = valors[0];
    quadre.style.background = valors[0];
  } else if (valors && valors.length === 2) {
    franja.style.background = `linear-gradient(${valors[0]} 50%, ${valors[1]} 50%)`;
    quadre.style.background = `linear-gradient(to bottom, ${valors[0]} 50%, ${valors[1]} 50%)`;
  } else {
    franja.style.background = 'transparent';
    quadre.style.background = 'transparent';
  }
});
});