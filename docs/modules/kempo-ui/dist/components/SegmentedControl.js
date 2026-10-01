import{html as t,css as e,unsafeHTML as s}from"../lit-all.min.js";import i from"./ShadowComponent.js";class n extends i{static formAssociated=!0;static properties={value:{type:String,reflect:!0},name:{type:String},persistentId:{type:String,reflect:!0,attribute:"persistent-id"}};constructor(){if(super(),this.value="",this.name="",this.persistentId=null,this.initialValue="","function"==typeof this.attachInternals)try{this.internals=this.attachInternals()}catch(t){}}connectedCallback(){super.connectedCallback(),this.initialValue=this.getAttribute("value")||"",this.addEventListener("slotchange",this.handleSlotChange,!0);const t=this.closest("form");t&&t.addEventListener("reset",this.handleReset,!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("slotchange",this.handleSlotChange,!0);const t=this.closest("form");t&&t.removeEventListener("reset",this.handleReset,!0)}updated(t){if(super.updated(t),t.has("persistentId")&&this.persistentId&&window?.localStorage){const t=window.localStorage.getItem(`segmented-control-persistent-id-${this.persistentId}`);null!==t&&(this.value=t)}if(t.has("value")){if(this.internals&&"function"==typeof this.internals.setFormValue)try{this.internals.setFormValue(this.value||null)}catch(t){}this.persistentId&&window?.localStorage&&window.localStorage.setItem(`segmented-control-persistent-id-${this.persistentId}`,this.value),this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0}))}}handleSlotChange=()=>{this.requestUpdate()};handleReset=()=>{this.value=this.initialValue};handleButtonClick=t=>{this.value=t};getOptions=()=>Array.from(this.children).filter(t=>"K-SC-OPTION"===t.tagName);render(){const e=this.getOptions();return t`
      <div class="btn-grp">
        ${e.map(e=>{const i=e.getAttribute("value")||"",n=i===this.value;return t`
            <button
              class="${n?"primary":""}"
              @click=${()=>this.handleButtonClick(i)}
              ?aria-pressed=${n}
            >${s(e.innerHTML)}</button>
          `})}
      </div>
      <slot style="display:none;"></slot>
    `}static styles=e`
    :host {
      display: block;
    }
  `}class a extends HTMLElement{connectedCallback(){this.hasAttribute("value")||this.setAttribute("value","")}}export default n;customElements.define("k-segmented-control",n),customElements.define("k-sc-option",a);