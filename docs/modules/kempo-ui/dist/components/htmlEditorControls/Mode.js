import HtmlEditorControl from"./HtmlEditorControl.js";import{html,css}from"../../lit-all.min.js";import"../Icon.js";export default class Mode extends HtmlEditorControl{static properties={mode:{type:String,reflect:!0}};connectedCallback(){super.connectedCallback(),this.updateMode(),this.editor?.addEventListener("mode-changed",()=>this.updateMode())}handleClick=()=>{this.editor&&(this.editor.mode="visual"===this.editor.mode?"code":"visual")};updateMode(){this.editor&&(this.mode=this.editor.mode)}static styles=[HtmlEditorControl.styles,css`
      :host {
        display: inline-flex;
      }
    `];render(){const t="code"===this.mode?`${this.buttonClasses} bg-primary`:this.buttonClasses;return html`
      <button class="${t}" @click="${this.handleClick}">
        <k-icon name="code"></k-icon>
      </button>
    `}}customElements.define("k-hec-mode",Mode);