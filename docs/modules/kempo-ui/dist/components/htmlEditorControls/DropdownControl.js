import HtmlEditorControl from"./HtmlEditorControl.js";import{html,css}from"../../lit-all.min.js";import"../Dropdown.js";import"../Icon.js";export default class DropdownControl extends HtmlEditorControl{static properties={opened:{type:Boolean,reflect:!0},editorMode:{type:String,state:!0}};constructor(){super(),this.opened=!1}connectedCallback(){super.connectedCallback(),this.updateEditorMode(),this.editor?.addEventListener("mode-changed",()=>this.updateEditorMode())}updated(t){super.updated(t),t.has("editorMode")&&requestAnimationFrame(()=>{this.hidden="code"===this.editorMode&&!this.hasVisibleChildren()})}updateEditorMode(){this.editor&&(this.editorMode=this.editor.mode)}hasVisibleChildren(){return Array.from(this.children).filter(t=>!t.hasAttribute("slot")).some(t=>{if(!1===t.hidden||void 0===t.hidden){return"none"!==window.getComputedStyle(t).display}return!1})}static styles=[HtmlEditorControl.styles,css`
      :host {
        display: inline-flex;
      }
      
      k-dropdown {
        display: inline-flex;
      }
      
      /* Override fixed sizing for dropdown trigger */
      button[slot="trigger"] {
        width: auto !important;
        height: auto !important;
        min-width: 40px;
        min-height: 40px;
      }
      
      /* Style slotted items (not icon or label) */
      ::slotted(:not([slot="icon"]):not([slot="label"])) {
        display: block !important;
      }
      
      ::slotted(:not([slot="icon"]):not([slot="label"])) .icon-btn,
      ::slotted(:not([slot="icon"]):not([slot="label"])) button {
        display: flex !important;
        width: 100% !important;
        height: auto !important;
        justify-content: flex-start !important;
        padding: 0.5rem 0.75rem !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        border-bottom: 1px solid var(--c_border) !important;
      }
      
      ::slotted(:not([slot="icon"]):not([slot="label"]):last-of-type) .icon-btn,
      ::slotted(:not([slot="icon"]):not([slot="label"]):last-of-type) button {
        border-bottom: none !important;
      }
    `];handleToggle=()=>{this.opened=!this.opened};handleOpened=()=>{this.opened=!0};handleClosed=()=>{this.opened=!1};render(){return html`
      <k-dropdown 
        ?opened=${this.opened}
        @opened=${this.handleOpened}
        @closed=${this.handleClosed}
      >
        <button 
          slot="trigger" 
          class="${this.buttonClasses}"
        >
          <slot name="icon">
            <k-icon name="arrow_drop_down"></k-icon>
          </slot>
          <slot name="label"></slot>
        </button>
        <slot></slot>
      </k-dropdown>
    `}}customElements.define("k-hec-dropdown",DropdownControl);