let minuts = 0;
let segons = 0;
let intervalId = null;

function obtenirElementTemps() {
  return document.getElementById('tempsLliga') || document.getElementById('temps');
}

// Detectem quin tipus de marcador tenim carregat
function esMarcadorLliga() {
  return document.getElementById('marcadorLliga') !== null;
}

db.ref('marcador').on('value', snapshot => {
  const data = snapshot.val();
  if (!data) return;

  // 1. TEMPS
  const elTemps = obtenirElementTemps();
  if (elTemps) elTemps.textContent = data.temps;

  // 2. GOLS I NOMS / ESCUTS
  const g1 = document.getElementById('gols1'), g2 = document.getElementById('gols2');
  const e1 = document.getElementById('equip1'), e2 = document.getElementById('equip2');

  if (g1) g1.textContent = data.gols1;
  if (g2) g2.textContent = data.gols2;

  if (e1 && e2) {
    if (data.mode === 'escut') {
      // Definim la ruta base sense extensió
      const logo1 = `assets/${data.equip1}`;
      const logo2 = `assets/${data.equip2}`;

      // Mode ESCUT: Intentem PNG, si falla salta a JPG gràcies a l'onerror
      e1.innerHTML = `<img src="${logo1}.png" class="escut-img" onerror="if (this.src.indexOf('.png') !== -1) this.src='${logo1}.jpg';">`;
      e2.innerHTML = `<img src="${logo2}.png" class="escut-img" onerror="if (this.src.indexOf('.png') !== -1) this.src='${logo2}.jpg';">`;
    } else {
      // Mode TEXT: Inserim el text normal
      e1.textContent = data.equip1;
      e2.textContent = data.equip2;
    }
  }

  // 3. COLORS (Amb filtre segons el tipus de marcador)
  const colors = data.colors || {};
  const esLliga = esMarcadorLliga();

  ['esquerra', 'dreta'].forEach(banda => {
    const valors = colors[banda];
    
    const idsCandidats = ['color-box-esquerra', 'color-box-dreta', 'color-box-lliga-esquerra', 'color-box-lliga-dreta', 'franja-esquerra', 'franja-dreta'];

    idsCandidats.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      let hauriaDeSerVisible = false;

      if (esLliga) {
        if (id.includes('lliga')) hauriaDeSerVisible = true;
      } else {
        if (!id.includes('lliga')) hauriaDeSerVisible = true;
      }

      if (hauriaDeSerVisible) {
        // Fem que torni a ser visible segons el tipus d'element
        el.style.display = id.includes('color-box') ? "inline-block" : "block"; 
        
        if (valors && valors.length === 1) {
          el.style.background = valors[0];
        } else if (valors && valors.length === 2) {
          el.style.background = `linear-gradient(to bottom, ${valors[0]} 50%, ${valors[1]} 50%)`;
        } else {
          el.style.background = 'transparent';
        }
      } else {
        el.style.display = "none";
      }
    });
  });
});