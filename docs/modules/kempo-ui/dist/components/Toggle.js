import{html,css}from"../lit-all.min.js";import ShadowComponent from"./ShadowComponent.js";export default class Toggle extends ShadowComponent{static properties={value:{type:Boolean,reflect:!0}};constructor(){super(),this.value=!1,this.tabIndex=0}updated(e){super.updated(e),e.has("value")&&this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0}))}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClick),this.addEventListener("keydown",this.handleKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClick),this.removeEventListener("keydown",this.handleKeyDown)}handleClick=()=>{this.toggle()};handleKeyDown=e=>{["Space","Enter"].includes(e.code)&&(e.preventDefault(),this.toggle())};on(){return this.value=!0,this.dispatchEvent(new CustomEvent("on",{detail:{value:!0},bubbles:!0})),this}off(){return this.value=!1,this.dispatchEvent(new CustomEvent("off",{detail:{value:!1},bubbles:!0})),this}toggle(){return this.value?this.off():this.on(),this.dispatchEvent(new CustomEvent("toggle",{detail:{value:this.value},bubbles:!0})),this}render(){return html`
      <div id="switch">
        <div id="handle"></div>
      </div>
      <label id="label">
        <slot></slot>
      </label>
    `}static styles=css`
    :host {
      --switch_height: 2rem;
      --switch_width: 3rem;
      --switch_border: 1px solid var(--c_border);
      --switch_background__off: var(--c_bg__alt);
      --switch_background__on: var(--c_success);
      --handle_size__off: 1rem;
      --handle_size__on: 1.5rem;
      --handle_border: 1px solid var(--c_border);
      --handle_background__off: var(--c_border);
      --handle_background__on: white;

      display: flex;
      align-items: center;
      cursor: pointer;
      margin-bottom: var(--spacer);
      border-radius: 999rem;
      outline: none;
    }

    #switch {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      flex-grow: 0;
      width: var(--switch_width);
      height: var(--switch_height);
      border: var(--switch_border);
      background: var(--switch_background__off);
      border-radius: 999rem;
      margin-right: var(--spacer);
      box-shadow: 0 0 0 transparent;
      will-change: box-shadow;
      transition: box-shadow var(--animation_ms, 256ms);
    }
    :host(:focus) #switch {
      box-shadow: var(--focus_shadow);
    }

    #handle {
      --margin: calc( (var(--switch_height) - var(--handle_size__off)) / 2);
      width: var(--handle_size__off);
      height: var(--handle_size__off);
      border: var(--handle_border);
      background: var(--handle_background__off);
      border-radius: 999rem;
      transform: translateX(var(--margin));
      transition: width var(--animation_ms, 256ms), height var(--animation_ms, 256ms), transform var(--animation_ms, 256ms);
    }

    :host([value]) #switch {
      background: var(--switch_background__on);
    }

    :host([value]) #handle {
      --m: calc( (var(--switch_height) - var(--handle_size__on)) / 2);
      --d: calc( var(--switch_width) - var(--handle_size__on) - var(--m));
      width: var(--handle_size__on);
      height: var(--handle_size__on);
      background: var(--handle_background__on);
      transform: translateX(var(--d));
    }

    #label {
      display: block;
      flex: 1 1 auto;
      padding: 0;
    }
  `}window.customElements.define("k-toggle",Toggle);