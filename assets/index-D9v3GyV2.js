(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`modulepreload`,t=function(e){return`/sushi-tap/`+e},n={},r=function(e){return e.pathname.endsWith(`.css`)},i=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},a=function(a,o,s){let c=Promise.resolve();if(o&&o.length>0){let a,l=document.querySelector(`meta[property=csp-nonce]`),u=l?.nonce||l?.getAttribute(`nonce`);function d(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function f(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}c=d(o.map(o=>{o=t(o,s);let c=f(o),l=r(c);return i(n,c.href,()=>{if(a===void 0){a={all:new Set,styles:new Set};let e=document.getElementsByTagName(`link`);for(let t=e.length-1;t>=0;t--){let n=e[t];a.all.add(n.href),n.rel===`stylesheet`&&a.styles.add(n.href)}}if((l?a.styles:a.all).has(c.href))return;let t=document.createElement(`link`);if(t.rel=l?`stylesheet`:e,l||(t.as=`script`),t.crossOrigin=``,t.href=c.href,u&&t.setAttribute(`nonce`,u),document.head.appendChild(t),l)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${c}`)))})})}).filter(e=>e!==void 0))}function l(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return c.then(e=>{for(let t of e||[])t.status===`rejected`&&l(t.reason);return a().catch(l)})},o=`true`,s=`false`,c=o===`true`,l=s===`true`;function u(e={}){let{immediate:t=!1,onNeedReload:n,onNeedRefresh:r,onOfflineReady:i,onRegistered:o,onRegisteredSW:s,onRegisterError:u}=e,d,f,p,m=async(e=!0)=>{await f,c||p?.()};async function h(){if(`serviceWorker`in navigator){if(d=await a(async()=>{let{Workbox:e}=await import(`./workbox-window.prod.es5-Bd17z0YL.js`);return{Workbox:e}},[]).then(({Workbox:e})=>new e(`/sushi-tap/sw.js`,{scope:`/sushi-tap/`,type:`classic`})).catch(e=>{u?.(e)}),!d)return;if(p=()=>{d?.messageSkipWaiting()},!l){if(c)d.addEventListener(`activated`,e=>{(e.isUpdate||e.isExternal)&&(n?n():window.location.reload())}),d.addEventListener(`installed`,e=>{e.isUpdate||i?.()});else{let e=!1,t=()=>{e=!0,d?.addEventListener(`controlling`,e=>{e.isUpdate&&(n?n():window.location.reload())}),r?.()};d.addEventListener(`installed`,n=>{n.isUpdate===void 0?n.isExternal===void 0?!e&&i?.():n.isExternal?t():!e&&i?.():n.isUpdate||i?.()}),d.addEventListener(`waiting`,t)}}d.register({immediate:t}).then(e=>{s?s(`/sushi-tap/sw.js`,e):o?.(e)}).catch(e=>{u?.(e)})}}return f=h(),m}u({immediate:!0,onRegisteredSW(e,t){t&&setInterval(()=>{t.update()},6e4)}});var d=`sushi-counter-v1`,f=780,p=`/sushi-tap/`,m={START:`start`,COUNTING:`counting`,SUMMARY:`summary`},h=document.querySelector(`#app`),g=k(),_=!1,v=0,y=!1,b=null,x=!1;function S(){return window.matchMedia(`(display-mode: standalone)`).matches||window.navigator.standalone===!0}function C(){return/iphone|ipad|ipod/i.test(window.navigator.userAgent)}function w(){return!S()}function T(e=`ghost`){return w()?`
    <button type="button" class="${e===`menu`?`side-menu-item`:`btn btn--${e}`}" data-action="install" data-stop>
      Descargar app
    </button>
  `:``}function E(){if(!x)return``;let e=C();return`
    <div class="install-tip" data-stop role="dialog" aria-modal="true" aria-labelledby="install-tip-title">
      <div class="install-tip-card" data-stop>
        <h2 id="install-tip-title" class="install-tip-title">
          ${e?`Instalar en iPhone`:`Instalar la app`}
        </h2>
        ${e?`<ol class="install-tip-steps">
                <li>Tocá el botón <strong>Compartir</strong> de Safari</li>
                <li>Elegí <strong>Agregar a pantalla de inicio</strong></li>
                <li>Confirmá con <strong>Agregar</strong></li>
              </ol>`:`<p class="install-tip-text">
                En Android: menú del navegador → <strong>Instalar app</strong> o <strong>Agregar a pantalla de inicio</strong>.
              </p>`}
        <button type="button" class="btn btn--primary" data-action="install-tip-close" data-stop>
          Entendido
        </button>
      </div>
    </div>
  `}window.addEventListener(`beforeinstallprompt`,e=>{e.preventDefault(),b=e,D()}),window.addEventListener(`appinstalled`,()=>{b=null,x=!1,D()});function D(){let e=document.querySelector(`[data-install-slot]`);e&&(e.innerHTML=T(`ghost`)),document.querySelectorAll(`[data-install-menu-slot]`).forEach(e=>{e.innerHTML=T(`menu`)});let t=document.querySelector(`.install-tip`);x&&!t?document.querySelector(`.screen`)?.insertAdjacentHTML(`beforeend`,E()):!x&&t&&t.remove()}async function O(){b?(b.prompt(),await b.userChoice,b=null,D()):(x=!0,D())}function k(){try{let e=localStorage.getItem(d);if(!e)return{phase:m.START,count:0};let t=JSON.parse(e);return{phase:Object.values(m).includes(t.phase)?t.phase:m.START,count:Number.isFinite(t.count)&&t.count>=0?t.count:0}}catch{return{phase:m.START,count:0}}}function A(){localStorage.setItem(d,JSON.stringify({phase:g.phase,count:g.count}))}function j(e){g.phase=e,y=!1,A(),F()}function M(e){g.count=Math.max(0,e),A();let t=document.querySelector(`[data-count]`);t&&(t.textContent=String(g.count));let n=document.querySelector(`[data-action="undo"]`);n&&(n.disabled=g.count===0)}function N(e){y=e;let t=document.querySelector(`.menu-shell`);if(!t)return;t.classList.toggle(`is-open`,y);let n=document.querySelector(`[data-action="menu-toggle"]`);n&&n.setAttribute(`aria-expanded`,String(y))}function P(e=``){return`
    <div class="menu-shell ${y?`is-open`:``}" data-stop>
      <button
        type="button"
        class="menu-toggle"
        data-action="menu-toggle"
        data-stop
        aria-label="Abrir menú"
        aria-expanded="${y}"
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
          ${e}
          <div data-install-menu-slot>${T(`menu`)}</div>
        </nav>
      </aside>
    </div>
  `}function F(){if(_=!1,g.phase===m.START)h.innerHTML=`
      <main class="screen screen--start">
        <div class="atmosphere" aria-hidden="true"></div>
        ${P()}
        <div class="start-content">
          <img
            class="start-fio"
            src="${p}fiorella-start.png"
            alt="Fiorella"
            draggable="false"
          />
          <p class="brand">Sushi Tap</p>
          <button type="button" class="btn btn--primary" data-action="start">
            Iniciar
          </button>
          <div data-install-slot>${T(`ghost`)}</div>
        </div>
        ${E()}
      </main>
    `;else if(g.phase===m.SUMMARY){let e=g.count===1?`pieza`:`piezas`;h.innerHTML=`
      <main class="screen screen--summary">
        <div class="atmosphere" aria-hidden="true"></div>
        ${P()}
        <div class="summary-content">
          <p class="brand brand--sm">Sushi Tap</p>
          <h1 class="summary-total">
            Comiste <span data-count>${g.count}</span> ${e}
          </h1>
          <p class="summary-note">¡Buen provecho!</p>
          <button type="button" class="btn btn--primary" data-action="restart">
            Otra vez
          </button>
        </div>
        ${E()}
      </main>
    `}else h.innerHTML=`
    <main class="screen screen--counting" data-action="eat" role="button" tabindex="0" aria-label="Comer una pieza de sushi">
      <div class="atmosphere" aria-hidden="true"></div>
      ${P(`
        <button type="button" class="side-menu-item" data-action="finish" data-stop>
          Finalizar
        </button>
      `)}
      <div class="stage">
        <img
          class="fiorella"
          src="${p}fiorella.png"
          alt=""
          aria-hidden="true"
          draggable="false"
        />
        <img
          class="sushi sushi--ready"
          src="${p}sushi.png"
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
              ${g.count===0?`disabled`:``}
            >
              −
            </button>
            <span class="counter-value" data-count>${g.count}</span>
            <span class="counter-spacer" aria-hidden="true"></span>
          </div>
        </div>
        <button type="button" class="btn btn--ghost" data-action="finish" data-stop>
          Finalizar
        </button>
      </footer>
      ${E()}
    </main>
  `}async function I(){if(_||g.phase!==m.COUNTING||y||Date.now()<v)return;_=!0;let e=document.querySelector(`.screen--counting`),t=document.querySelector(`.sushi`),n=document.querySelector(`.fiorella`);!e||!t||!n||(M(g.count+1),e.classList.add(`is-eating`),n.classList.add(`is-in`),t.classList.remove(`sushi--ready`),t.classList.add(`sushi--eaten`),await L(f),n.classList.remove(`is-in`),n.classList.add(`is-out`),await L(220),t.classList.remove(`sushi--eaten`),t.offsetWidth,t.classList.add(`sushi--enter`),e.classList.remove(`is-eating`),n.classList.remove(`is-out`),await L(320),t.classList.remove(`sushi--enter`),t.classList.add(`sushi--ready`)),_=!1}function L(e){return new Promise(t=>setTimeout(t,e))}h.addEventListener(`click`,e=>{let t=e.target.closest(`[data-stop]`),n=e.target.closest(`[data-action]`)?.dataset.action;n===`menu-toggle`?(e.stopPropagation(),N(!y)):n===`menu-close`?(e.stopPropagation(),N(!1)):n===`go-home`?(e.stopPropagation(),g.count=0,j(m.START)):n===`install`?(e.stopPropagation(),O()):n===`install-tip-close`?(e.stopPropagation(),x=!1,D()):n===`start`?(g.count=0,v=Date.now()+350,j(m.COUNTING)):n===`finish`?(e.stopPropagation(),N(!1),j(m.SUMMARY)):n===`undo`?(e.stopPropagation(),g.count>0&&!_&&M(g.count-1)):n===`restart`?(g.count=0,j(m.START)):t||g.phase===m.COUNTING&&I()}),h.addEventListener(`keydown`,e=>{e.key===`Escape`&&y?N(!1):g.phase!==m.COUNTING||y||(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),I())}),F();