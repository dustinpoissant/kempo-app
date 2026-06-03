import e from"./Control.js";import{css as t,html as i}from"../../lit-all.min.js";export default class s extends e{connectedCallback(){super.connectedCallback(),this.hasAttribute("role")||this.setAttribute("role","button"),this.hasAttribute("tabindex")||(this.tabIndex=this.disabled?-1:0),this.setAttribute("aria-disabled",String(!!this.disabled)),this.addEventListener("click",this.handleClick),this.addEventListener("keydown",this.handleKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClick),this.removeEventListener("keydown",this.handleKeyDown)}updated(e){super.updated(e),e.has("disabled")&&(this.tabIndex=this.disabled?-1:0,this.setAttribute("aria-disabled",String(this.disabled)))}handleAction(){}handleClick=e=>{this.disabled?e.stopImmediatePropagation():this.handleAction()};handleKeyDown=e=>{this.disabled||"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this.click())};render(){return i`<slot></slot>`}static styles=[e.styles,t`
      :host {
        align-items: center;
        justify-content: center;
        min-width: 2rem;
        min-height: 2rem;
        background: transparent;
        border: 1px solid var(--c_border);
        border-radius: var(--radius);
        margin: var(--spacer_q);
        padding: var(--spacer_h);
        color: inherit;
        cursor: pointer;
        outline: none;
        font-size: inherit;
        user-select: none;
        transition: background-color var(--animation_ms), box-shadow var(--animation_ms);
      }
      :host(:not([disabled]):hover) {
        background: oklch(from var(--c_bg__inv) l c h / 0.15);
      }
      :host(:not([disabled]):focus),
      :host(:not([disabled]):focus-visible) {
        box-shadow: var(--focus_shadow);
        z-index: 1;
      }
      :host([disabled]) {
        cursor: default;
      }
      :host([active]) {
        background: oklch(from var(--c_primary) l c h / 0.18);
      }
    `]}customElements.define("kc-button",s);