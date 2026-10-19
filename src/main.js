import './style.css'

const STORAGE_KEY = 'sushi-counter-v1'
const EAT_DURATION_MS = 780
const BASE = import.meta.env.BASE_URL

const PHASE = {
  START: 'start',
  COUNTING: 'counting',
  SUMMARY: 'summary',
}

const app = document.querySelector('#app')

let state = loadState()
let isAnimating = false
let ignoreTapsUntil = 0
let menuOpen = false
let deferredInstallPrompt = null
let installTipOpen = false

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function canShowInstall() {
  return !isStandalone()
}

function installButtonMarkup(variant = 'ghost') {
  if (!canShowInstall()) return ''
  const cls = variant === 'menu' ? 'side-menu-item' : `btn btn--${variant}`
  return `
    <button type="button" class="${cls}" data-action="install" data-stop>
      Descargar app
    </button>
  `
}

function installTipMarkup() {
  if (!installTipOpen) return ''
  const ios = isIos()
  return `
    <div class="install-tip" data-stop role="dialog" aria-modal="true" aria-labelledby="install-tip-title">
      <div class="install-tip-card" data-stop>
        <h2 id="install-tip-title" class="install-tip-title">
          ${ios ? 'Instalar en iPhone' : 'Instalar la app'}
        </h2>
        ${
          ios
            ? `<ol class="install-tip-steps">
                <li>Tocá el botón <strong>Compartir</strong> de Safari</li>
                <li>Elegí <strong>Agregar a pantalla de inicio</strong></li>
                <li>Confirmá con <strong>Agregar</strong></li>
              </ol>`
            : `<p class="install-tip-text">
                En Android: menú del navegador → <strong>Instalar app</strong> o <strong>Agregar a pantalla de inicio</strong>.
              </p>`
        }
        <button type="button" class="btn btn--primary" data-action="install-tip-close" data-stop>
          Entendido
        </button>
      </div>
    </div>
  `
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredInstallPrompt = event
  refreshInstallButtons()
})

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null
  installTipOpen = false
  refreshInstallButtons()
})

function refreshInstallButtons() {
  const startSlot = document.querySelector('[data-install-slot]')
  if (startSlot) {
    startSlot.innerHTML = installButtonMarkup('ghost')
  }
  document.querySelectorAll('[data-install-menu-slot]').forEach((slot) => {
    slot.innerHTML = installButtonMarkup('menu')
  })
  const tip = document.querySelector('.install-tip')
  if (installTipOpen && !tip) {
    document.querySelector('.screen')?.insertAdjacentHTML('beforeend', installTipMarkup())
  } else if (!installTipOpen && tip) {
    tip.remove()
  }
}

async function handleInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt()
    await deferredInstallPrompt.userChoice
    deferredInstallPrompt = null
    refreshInstallButtons()
    return
  }
  installTipOpen = true
  refreshInstallButtons()
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { phase: PHASE.START, count: 0 }
    const parsed = JSON.parse(raw)
    return {
      phase: Object.values(PHASE).includes(parsed.phase)
        ? parsed.phase
        : PHASE.START,
      count: Number.isFinite(parsed.count) && parsed.count >= 0 ? parsed.count : 0,
    }
  } catch {
    return { phase: PHASE.START, count: 0 }
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ phase: state.phase, count: state.count }),
  )
}

function setPhase(phase) {
  state.phase = phase
  menuOpen = false
  saveState()
  render()
}

function setCount(count) {
  state.count = Math.max(0, count)
  saveState()
  const el = document.querySelector('[data-count]')
  if (el) el.textContent = String(state.count)
  const undoBtn = document.querySelector('[data-action="undo"]')
  if (undoBtn) undoBtn.disabled = state.count === 0
}

function setMenuOpen(open) {
  menuOpen = open
  const shell = document.querySelector('.menu-shell')
  if (!shell) return
  shell.classList.toggle('is-open', menuOpen)
  const btn = document.querySelector('[data-action="menu-toggle"]')
  if (btn) btn.setAttribute('aria-expanded', String(menuOpen))
}

function menuMarkup(extraItems = '') {
  return `
    <div class="menu-shell ${menuOpen ? 'is-open' : ''}" data-stop>
      <button
        type="button"
        class="menu-toggle"
        data-action="menu-toggle"
        data-stop
        aria-label="Abrir menú"
        aria-expanded="${menuOpen}"
        aria-controls="side-menu"
      >
        <span class="menu-toggle-bar" aria-hidden="true"></span>
        <span class="menu-toggle-bar" aria-hidden="true"></span>
        <span class="menu-toggle-bar" aria-hidden="true"></span>
      </button>
      <div class="menu-backdrop" data-action="menu-close" data-stop></div>
      <aside id="side-menu" class="side-menu" data-stop aria-label="Menú">
        <p class="side-menu-brand">Sushi Tap</p>
        <nav class="side-menu-nav">
          <button type="button" class="side-menu-item" data-action="go-home" data-stop>
            Inicio
          </button>
          ${extraItems}
          <div data-install-menu-slot>${installButtonMarkup('menu')}</div>
        </nav>
      </aside>
    </div>
  `
}

function render() {
  isAnimating = false

  if (state.phase === PHASE.START) {
    app.innerHTML = `
      <main class="screen screen--start">
        <div class="atmosphere" aria-hidden="true"></div>
        ${menuMarkup()}
        <div class="start-content">
          <img
            class="start-fio"
            src="${BASE}fiorella-start.png"
            alt="Fiorella"
            draggable="false"
          />
          <p class="brand">Sushi Tap</p>
          <button type="button" class="btn btn--primary" data-action="start">
            Iniciar
          </button>
          <div data-install-slot>${installButtonMarkup('ghost')}</div>
        </div>
        ${installTipMarkup()}
      </main>
    `
    return
  }

  if (state.phase === PHASE.SUMMARY) {
    const label = state.count === 1 ? 'pieza' : 'piezas'
    app.innerHTML = `
      <main class="screen screen--summary">
        <div class="atmosphere" aria-hidden="true"></div>
        ${menuMarkup()}
        <div class="summary-content">
          <p class="brand brand--sm">Sushi Tap</p>
          <h1 class="summary-total">
            Comiste <span data-count>${state.count}</span> ${label}
          </h1>
          <p class="summary-note">¡Buen provecho!</p>
          <button type="button" class="btn btn--primary" data-action="restart">
            Otra vez
          </button>
        </div>
        ${installTipMarkup()}
      </main>
    `
    return
  }

  app.innerHTML = `
    <main class="screen screen--counting" data-action="eat" role="button" tabindex="0" aria-label="Comer una pieza de sushi">
      <div class="atmosphere" aria-hidden="true"></div>
      ${menuMarkup(`
        <button type="button" class="side-menu-item" data-action="finish" data-stop>
          Finalizar
        </button>
      `)}
      <div class="stage">
        <img
          class="fiorella"
          src="${BASE}fiorella.png"
          alt=""
          aria-hidden="true"
          draggable="false"
        />
        <img
          class="sushi sushi--ready"
          src="${BASE}sushi.png"
          alt="Pieza de sushi"
          draggable="false"
        />
      </div>
      <footer class="footer" data-stop>
        <div class="footer-main">
          <span class="counter-label">Piezas</span>
          <div class="counter-row">
            <button
              type="button"
              class="btn btn--round"
              data-action="undo"
              data-stop
              aria-label="Restar una pieza"
              ${state.count === 0 ? 'disabled' : ''}
            >
              −
            </button>
            <span class="counter-value" data-count>${state.count}</span>
            <span class="counter-spacer" aria-hidden="true"></span>
          </div>
        </div>
        <button type="button" class="btn btn--ghost" data-action="finish" data-stop>
          Finalizar
        </button>
      </footer>
      ${installTipMarkup()}
    </main>
  `
}

async function eatSushi() {
  if (isAnimating || state.phase !== PHASE.COUNTING || menuOpen) return
  if (Date.now() < ignoreTapsUntil) return
  isAnimating = true

  const screen = document.querySelector('.screen--counting')
  const sushi = document.querySelector('.sushi')
  const fiorella = document.querySelector('.fiorella')
  if (!screen || !sushi || !fiorella) {
    isAnimating = false
    return
  }

  setCount(state.count + 1)
  screen.classList.add('is-eating')
  fiorella.classList.add('is-in')
  sushi.classList.remove('sushi--ready')
  sushi.classList.add('sushi--eaten')

  await wait(EAT_DURATION_MS)

  fiorella.classList.remove('is-in')
  fiorella.classList.add('is-out')
  await wait(220)

  sushi.classList.remove('sushi--eaten')
  void sushi.offsetWidth
  sushi.classList.add('sushi--enter')
  screen.classList.remove('is-eating')
  fiorella.classList.remove('is-out')

  await wait(320)
  sushi.classList.remove('sushi--enter')
  sushi.classList.add('sushi--ready')
  isAnimating = false
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

app.addEventListener('click', (event) => {
  const stop = event.target.closest('[data-stop]')
  const actionEl = event.target.closest('[data-action]')
  const action = actionEl?.dataset.action

  if (action === 'menu-toggle') {
    event.stopPropagation()
    setMenuOpen(!menuOpen)
    return
  }

  if (action === 'menu-close') {
    event.stopPropagation()
    setMenuOpen(false)
    return
  }

  if (action === 'go-home') {
    event.stopPropagation()
    state.count = 0
    setPhase(PHASE.START)
    return
  }

  if (action === 'install') {
    event.stopPropagation()
    handleInstall()
    return
  }

  if (action === 'install-tip-close') {
    event.stopPropagation()
    installTipOpen = false
    refreshInstallButtons()
    return
  }

  if (action === 'start') {
    state.count = 0
    ignoreTapsUntil = Date.now() + 350
    setPhase(PHASE.COUNTING)
    return
  }

  if (action === 'finish') {
    event.stopPropagation()
    setMenuOpen(false)
    setPhase(PHASE.SUMMARY)
    return
  }

  if (action === 'undo') {
    event.stopPropagation()
    if (state.count > 0 && !isAnimating) setCount(state.count - 1)
    return
  }

  if (action === 'restart') {
    state.count = 0
    setPhase(PHASE.START)
    return
  }

  if (stop) return

  if (state.phase === PHASE.COUNTING) {
    eatSushi()
  }
})

app.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuOpen) {
    setMenuOpen(false)
    return
  }
  if (state.phase !== PHASE.COUNTING || menuOpen) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    eatSushi()
  }
})

render()
