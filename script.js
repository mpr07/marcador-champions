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
});