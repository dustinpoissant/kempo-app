import t from"./ShadowComponent.js";import{html as e,css as i}from"../lit-all.min.js";export default class s extends t{static properties={disabled:{type:Boolean,reflect:!0}};connectedCallback(){super.connectedCallback(),this.hasAttribute("role")||this.setAttribute("role","button"),this.hasAttribute("tabindex")||(this.tabIndex=this.disabled?-1:0),this.setAttribute("aria-disabled",String(!!this.disabled)),this.addEventListener("click",this.handleClick),this.addEventListener("keydown",this.handleKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClick),this.removeEventListener("keydown",this.handleKeyDown)}updated(t){super.updated(t),t.has("disabled")&&(this.tabIndex=this.disabled?-1:0,this.setAttribute("aria-disabled",String(this.disabled)))}handleClick=t=>{this.disabled&&t.stopImmediatePropagation()};handleKeyDown=t=>{this.disabled||"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this.click())};render(){return e`<slot></slot>`}static styles=i`
    :host {
      display: inline-block;
      padding: var(--btn_padding);
      background-color: var(--btn_bg);
      border: 1px solid var(--btn_border);
      cursor: pointer;
      outline: none;
      border-radius: var(--radius);
      color: var(--btn_tc);
      transition: background-color var(--animation_ms), box-shadow var(--animation_ms);
      box-shadow: var(--btn_box_shadow);
      font-size: inherit;
      vertical-align: middle;
      user-select: none;
    }
    :host(:not([disabled]):hover) {
      background-color: var(--btn_bg__hover);
      color: var(--btn_tc);
      box-shadow: var(--btn_box_shadow__hover);
    }
    :host(:not([disabled]):focus),
    :host(:not([disabled]):focus-visible) {
      box-shadow: var(--focus_shadow);
      z-index: 1;
    }
    :host([disabled]) {
      opacity: 0.6;
    }
  `}