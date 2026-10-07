const escena = document.getElementById('escena');
const sobre  = document.getElementById('sobre');
const carta  = document.getElementById('carta');
const musica = document.getElementById('musica');
let abierto = false;

const VOLUMEN = 0.7;      // volumen final (0 a 1)
const FUNDIDO_MS = 3000;  // la música entra poco a poco en este tiempo

function subirVolumen() {
  const paso = 50;
  const incremento = VOLUMEN / (FUNDIDO_MS / paso);
  const t = setInterval(() => {
    musica.volume = Math.min(VOLUMEN, musica.volume + incremento);
    if (musica.volume >= VOLUMEN) clearInterval(t);
  }, paso);
}

function iniciarMusica() {
  // Sin archivo en <audio src="..."> no hay nada que reproducir
  if (!musica.getAttribute('src')) return;

  musica.volume = 0;
  const promesa = musica.play();
  if (promesa && promesa.then) {
    promesa.then(subirVolumen).catch(() => {
      // Si el navegador la bloquea, se reintenta con el siguiente toque
      document.addEventListener('pointerdown', () => {
        musica.play().then(subirVolumen).catch(() => {});
      }, { once: true });
    });
  } else {
    subirVolumen();
  }
}

musica.addEventListener('error', () => {
  if (musica.getAttribute('src')) {
    console.warn('No se pudo cargar el audio. Revisa la ruta en <audio src="...">:', musica.getAttribute('src'));
  }
});

function abrirSobre() {
  if (abierto) return;
  abierto = true;

  // La música arranca con el clic (los navegadores lo exigen)
  iniciarMusica();

  // 1) La solapa se levanta con el sello pegado a ella; el papel asoma
  sobre.classList.add('abierto');

  // 2) El sobre se desvanece y la carta aparece
  setTimeout(() => {
    carta.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => carta.classList.add('visible')));
    escena.classList.add('sale');
    window.scrollTo(0, 0);
  }, 2300);

  // 3) Se retira el sobre del DOM
  setTimeout(() => escena.remove(), 3500);
}

sobre.addEventListener('click', abrirSobre);
sobre.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirSobre(); }
});
