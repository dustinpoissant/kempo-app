import{html as e,css as t}from"../lit-all.min.js";import i from"./ShadowComponent.js";export default class r extends i{static formAssociated=!0;static properties={value:{type:String,reflect:!0},name:{type:String,reflect:!0},increment:{type:Number,reflect:!0},military:{type:Boolean,reflect:!0},disabled:{type:Boolean,reflect:!0},required:{type:Boolean,reflect:!0}};constructor(){super(),this.internals=this.attachInternals(),this.value="",this.name="",this.increment=1,this.military=!1,this.disabled=!1,this.required=!1}updated(e){super.updated(e),this.internals.setFormValue(this.value),this.required&&!this.value?this.internals.setValidity({valueMissing:!0},"Please enter a time.",this.shadowRoot?.querySelector("input")):this.internals.setValidity({}),e.has("value")&&void 0!==e.get("value")&&this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0}))}get stepSeconds(){return 60*Math.max(1,Math.floor(this.increment||1))}roundToIncrement=e=>{if(!e)return"";const[t,i]=e.split(":");let r=Number(t),a=Number(i);if(isNaN(r)||isNaN(a))return e;const s=Math.max(1,Math.floor(this.increment||1));return a=Math.round(a/s)*s,a>=60&&(a-=60,r=(r+1)%24),`${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")}`};handleNativeChange=e=>{this.disabled||(this.value=e.target.value||"")};handleBlur=e=>{if(this.disabled)return;const t=this.roundToIncrement(e.target.value);t!==this.value&&(this.value=t)};render(){return e`
      <input
        type="time"
        .value=${this.value||""}
        step=${this.stepSeconds}
        lang=${this.military?"en-GB":"en-US"}
        ?disabled=${this.disabled}
        ?required=${this.required}
        @change=${this.handleNativeChange}
        @blur=${this.handleBlur}
      />
    `}static styles=t`
    :host {
      display: inline-block;
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }
    input {
      padding: var(--spacer_h) var(--spacer);
      border: 1px solid var(--c_border);
      border-radius: var(--radius);
      background: var(--c_bg);
      color: var(--tc);
      font: inherit;
      outline: none;
      box-sizing: border-box;
      transition: border-color var(--animation_ms);
    }
    input:focus {
      border-color: var(--c_primary);
    }
    input::-webkit-calendar-picker-indicator {
      display: none;
    }
  `}customElements.define("k-time",r);