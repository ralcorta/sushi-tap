import './style.css'

const STORAGE_KEY = 'sushi-counter-v1'
const EAT_DURATION_MS = 780

const PHASE = {
  START: 'start',
  COUNTING: 'counting',
  SUMMARY: 'summary',
}

const app = document.querySelector('#app')

let state = loadState()
let isAnimating = false
let ignoreTapsUntil = 0

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

function render() {
  isAnimating = false

  if (state.phase === PHASE.START) {
    app.innerHTML = `
      <main class="screen screen--start">
        <div class="atmosphere" aria-hidden="true"></div>
        <div class="start-content">
          <p class="brand">Sushi Counter</p>
          <p class="tagline">Tocá. Comé. Contá.</p>
          <button type="button" class="btn btn--primary" data-action="start">
            Iniciar
          </button>
        </div>
      </main>
    `
    return
  }

  if (state.phase === PHASE.SUMMARY) {
    const label = state.count === 1 ? 'pieza' : 'piezas'
    app.innerHTML = `
      <main class="screen screen--summary">
        <div class="atmosphere" aria-hidden="true"></div>
        <div class="summary-content">
          <p class="brand brand--sm">Sushi Counter</p>
          <h1 class="summary-total">
            Comieron <span data-count>${state.count}</span> ${label}
          </h1>
          <p class="summary-note">¡Buen provecho!</p>
          <button type="button" class="btn btn--primary" data-action="restart">
            Otra vez
          </button>
        </div>
      </main>
    `
    return
  }

  app.innerHTML = `
    <main class="screen screen--counting" data-action="eat" role="button" tabindex="0" aria-label="Comer una pieza de sushi">
      <div class="atmosphere" aria-hidden="true"></div>
      <div class="stage">
        <img
          class="fiorella"
          src="${import.meta.env.BASE_URL}fiorella.png"
          alt=""
          aria-hidden="true"
          draggable="false"
        />
        <img
          class="sushi sushi--ready"
          src="${import.meta.env.BASE_URL}sushi.png"
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
    </main>
  `
}

async function eatSushi() {
  if (isAnimating || state.phase !== PHASE.COUNTING) return
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

  if (action === 'start') {
    state.count = 0
    ignoreTapsUntil = Date.now() + 350
    setPhase(PHASE.COUNTING)
    return
  }

  if (action === 'finish') {
    event.stopPropagation()
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
  if (state.phase !== PHASE.COUNTING) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    eatSushi()
  }
})

render()
