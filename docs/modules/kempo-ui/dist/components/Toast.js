import{html,css}from"../lit-all.min.js";import ShadowComponent from"./ShadowComponent.js";import"./Icon.js";export default class Toast extends ShadowComponent{static properties={actionHtml:{type:String,reflect:!0,attribute:"action-html"},closeHtml:{type:String,reflect:!0,attribute:"close-html"},timeout:{type:Number,reflect:!0},opened:{type:Boolean,reflect:!0},hasAction:{type:Boolean,reflect:!0,attribute:"has-action"},hasClose:{type:Boolean,reflect:!0,attribute:"has-close"},hasIcon:{type:Boolean,reflect:!0,attribute:"has-icon"},position:{type:String,reflect:!0},animating:{type:String,reflect:!0}};static styles=css`
    @keyframes toast-show-bottom {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toast-hide-bottom {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
    @keyframes toast-show-top {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toast-hide-top {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-20px); }
    }
    @keyframes toast-show-left {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes toast-hide-left {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(-20px); }
    }
    @keyframes toast-show-right {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes toast-hide-right {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(20px); }
    }

    :host {
      display: none;
      min-width: 16rem;
      max-width: calc(100% - (2 * var(--spacer, 1rem)));
      background-color: var(--c_bg, #ffffff);
      border-radius: var(--radius, 0.375rem);
    }

    :host([opened]) {
      display: flex;
    }

    :host([animating="in"][position*="bottom"]) {
      animation: toast-show-bottom var(--animation_ms, 300ms) ease forwards;
    }
    :host([animating="out"][position*="bottom"]) {
      animation: toast-hide-bottom var(--animation_ms, 300ms) ease forwards;
    }
    :host([animating="in"][position*="top"]) {
      animation: toast-show-top var(--animation_ms, 300ms) ease forwards;
    }
    :host([animating="out"][position*="top"]) {
      animation: toast-hide-top var(--animation_ms, 300ms) ease forwards;
    }
    :host([animating="in"][position*="left"]:not([position*="top"]):not([position*="bottom"])) {
      animation: toast-show-left var(--animation_ms, 300ms) ease forwards;
    }
    :host([animating="out"][position*="left"]:not([position*="top"]):not([position*="bottom"])) {
      animation: toast-hide-left var(--animation_ms, 300ms) ease forwards;
    }
    :host([animating="in"][position*="right"]:not([position*="top"]):not([position*="bottom"])) {
      animation: toast-show-right var(--animation_ms, 300ms) ease forwards;
    }
    :host([animating="out"][position*="right"]:not([position*="top"]):not([position*="bottom"])) {
      animation: toast-hide-right var(--animation_ms, 300ms) ease forwards;
    }

    #icon {
      padding: var(--spacer, 1rem);
      padding-right: 0;
    }

    #message {
      padding: var(--spacer, 1rem);
      flex: 1 1 auto;
    }

    :host(:not([has-close])) #close,
    :host(:not([has-action])) #action,
    :host(:not([has-icon])) #icon {
      display: none;
    }

    #action {
      background: transparent;
      border: none;
      color: var(--tc_primary, blue);
      cursor: pointer;
      padding: var(--spacer, 1rem);
    }

    #action:hover {
      color: var(--tc_primary__hover, lightblue);
    }

    #close {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: var(--spacer, 1rem);
      opacity: 0.7;
      transition: opacity var(--animation_ms, 300ms);
    }

    #close:hover {
      opacity: 1;
    }

    /* Theme classes */
    :host(.bg-success) {
      background-color: var(--c_success, #dcfce7);
      color: var(--tc_on_success, #166534);
    }

    :host(.bg-warning) {
      background-color: var(--c_warning, #fef3c7);
      color: var(--tc_on_warning, #92400e);
    }

    :host(.bg-danger) {
      background-color: var(--c_danger, #fee2e2);
      color: var(--tc_on_danger, #991b1b);
    }
  `;constructor(){super(),this.actionHtml="",this.closeHtml="",this.timeout=0,this.opened=!1,this.hasAction=!1,this.hasClose=!1,this.hasIcon=!1,this.position="bottom center",this.animating="",this.actionCallback=()=>{},this.closeCallback=()=>{},this.timeoutId=null,this.closing=!1}updated(t){super.updated(t),t.has("opened")&&this.opened&&(this.hasAction=!!this.querySelector('[slot="action"]'),this.hasClose=!!this.querySelector('[slot="close"]'),this.hasIcon=!!this.querySelector('[slot="icon"]'))}connectedCallback(){super.connectedCallback(),this.addEventListener("animationend",this.handleAnimationEnd)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("animationend",this.handleAnimationEnd),clearTimeout(this.timeoutId)}handleActionClick=()=>{!1!==this.actionCallback()&&this.close()};handleCloseClick=()=>{this.close()};handleAnimationEnd=t=>{t.animationName.includes("toast-hide")?(this.animating="",this.opened=!1,this.dispatchEvent(new CustomEvent("close")),this.dispatchEvent(new CustomEvent("openchange")),this.closeCallback(),this.closing=!1):t.animationName.includes("toast-show")&&(this.animating="")};open(){this.closing=!1,this.animating="in",this.opened=!0,this.timeout&&(clearTimeout(this.timeoutId),this.timeoutId=setTimeout(()=>{this.close()},this.timeout)),this.dispatchEvent(new CustomEvent("open")),this.dispatchEvent(new CustomEvent("openchange"))}close(){clearTimeout(this.timeoutId),this.opened&&!this.closing&&(this.closing=!0,this.animating="out")}render(){return html`
      <div id="icon">
        <slot name="icon"></slot>
      </div>
      <div id="message">
        <slot></slot>
      </div>
      <button id="action" class="no-style" @click="${this.handleActionClick}">
        <slot name="action"></slot>
      </button>
      <button id="close" class="no-style" @click="${this.handleCloseClick}">
        <slot name="close"></slot>
      </button>
    `}static create(t,o={}){let{position:e="auto",removeOnClose:n=!0,closeCallback:s=()=>{},action:a=!1,close:i=!1,icon:r=!1,timeout:c=5e3}=o;"auto"===e&&(e=window.innerWidth<=768?"bottom center":"top right");let l=document.querySelector(`k-toast-container[position="${e}"]`);l||(l=new ToastContainer(e),document.body.appendChild(l));const m=new Toast;m.position=e,m.timeout=c,m.innerHTML=t,m.actionCallback=o.actionCallback||(()=>{});const h=s;if(m.closeCallback=(...t)=>{n&&(m.remove(),0===l.children.length&&l.remove()),h(...t)},r){const t=document.createElement("span");t.slot="icon",r instanceof HTMLElement?t.appendChild(r):t.innerHTML=r,m.appendChild(t)}if(a){const t=document.createElement("span");t.slot="action",a instanceof HTMLElement?t.appendChild(a):t.innerHTML=a,m.appendChild(t)}if(i){const t=document.createElement("span");t.slot="close",i instanceof HTMLElement?t.appendChild(i):t.innerHTML=i,m.appendChild(t)}return l.appendChild(m),m.open(),m}static success(t,o={}){const e=Toast.create(t,{icon:'<k-icon name="check"></k-icon>',...o});return e.classList.add("bg-success"),e}static warning(t,o={}){const e=Toast.create(t,{icon:'<k-icon name="warning"></k-icon>',...o});return e.classList.add("bg-warning"),e}static error(t,o={}){const e=Toast.create(t,{icon:'<k-icon name="error"></k-icon>',...o});return e.classList.add("bg-danger"),e}}class ToastContainer extends HTMLElement{constructor(t="bottom center"){super(),this.position=t.toLowerCase(),this.setAttribute("position",this.position),this.applyStyles()}applyStyles(){this.style.cssText="\n      position: fixed;\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n      z-index: 1000;\n      pointer-events: auto;\n      padding: 32px;\n      box-sizing: border-box;\n      max-width: 100%;\n      max-height: 100%;\n      overflow: visible;\n    ";new MutationObserver(()=>{Array.from(this.children).forEach(t=>{"K-TOAST"===t.tagName&&(t.style.filter="drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))")})}).observe(this,{childList:!0}),Array.from(this.children).forEach(t=>{"K-TOAST"===t.tagName&&(t.style.filter="drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))")});const[t,o]=this.position.split(" ");"top"===t?this.style.top="0":this.style.bottom="0","left"===o?(this.style.left="0",this.style.alignItems="flex-start"):"right"===o?(this.style.right="0",this.style.alignItems="flex-end"):"center"===o&&("top"===t||"bottom"===t?(this.style.left="50%",this.style.transform="translateX(-50%)",this.style.alignItems="center"):(this.style.top="50%",this.style.left="50%",this.style.transform="translate(-50%, -50%)"))}static getContainer(t){let o=document.querySelector(`k-toast-container[position="${t}"]`);return o||(o=new ToastContainer(t),document.body.appendChild(o)),o}}window.customElements.define("k-toast",Toast),window.customElements.define("k-toast-container",ToastContainer);