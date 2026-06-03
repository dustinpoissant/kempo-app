import{html as t,css as e,unsafeHTML as s}from"../lit-all.min.js";import n from"./ShadowComponent.js";class i extends n{static formAssociated=!0;static properties={value:{type:String,reflect:!0},name:{type:String}};constructor(){if(super(),this.value="",this.name="",this.initialValue="","function"==typeof this.attachInternals)try{this.internals=this.attachInternals()}catch(t){}}connectedCallback(){super.connectedCallback(),this.initialValue=this.getAttribute("value")||"",this.addEventListener("slotchange",this.handleSlotChange,!0);const t=this.closest("form");t&&t.addEventListener("reset",this.handleReset,!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("slotchange",this.handleSlotChange,!0);const t=this.closest("form");t&&t.removeEventListener("reset",this.handleReset,!0)}updated(t){if(super.updated(t),t.has("value")){if(this.internals&&"function"==typeof this.internals.setFormValue)try{this.internals.setFormValue(this.value||null)}catch(t){}this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0}))}}handleSlotChange=()=>{this.requestUpdate()};handleReset=()=>{this.value=this.initialValue};handleButtonClick=t=>{this.value=t};getOptions=()=>Array.from(this.children).filter(t=>"K-SC-OPTION"===t.tagName);render(){const e=this.getOptions();return t`
      <div class="btn-grp">
        ${e.map(e=>{const n=e.getAttribute("value")||"",i=n===this.value;return t`
            <button
              class="${i?"primary":""}"
              @click=${()=>this.handleButtonClick(n)}
              ?aria-pressed=${i}
            >${s(e.innerHTML)}</button>
          `})}
      </div>
      <slot style="display:none;"></slot>
    `}static styles=e`
    :host {
      display: block;
    }
  `}class a extends HTMLElement{connectedCallback(){this.hasAttribute("value")||this.setAttribute("value","")}}export default i;customElements.define("k-segmented-control",i),customElements.define("k-sc-option",a);