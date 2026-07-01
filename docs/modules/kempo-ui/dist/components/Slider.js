import{html as t,css as e}from"../lit-all.min.js";import i from"./ShadowComponent.js";import{bound as s}from"../utils/number.js";export default class r extends i{static formAssociated=!0;static properties={value:{type:String,reflect:!0},name:{type:String,reflect:!0},min:{type:Number,reflect:!0},max:{type:Number,reflect:!0},steps:{type:String,reflect:!0},format:{type:String,reflect:!0},tooltip:{type:Boolean,reflect:!0},vertical:{type:Boolean,reflect:!0},disabled:{type:Boolean,reflect:!0}};#t=null;constructor(){super(),this.internals=this.attachInternals(),this.value="0",this.name="",this.min=0,this.max=100,this.steps=null,this.format=null,this.tooltip=!1,this.vertical=!1,this.disabled=!1,this.tabIndex=0}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this.handleKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.handleKeyDown)}get isRange(){return String(this.value).includes(",")}get formattedValue(){return this.format?this.isRange?`${this.formatValue(this.lower)},${this.formatValue(this.upper)}`:this.formatValue(this.lower):this.value}updated(t){super.updated(t),this.internals.setFormValue(this.formattedValue)}dispatchChange=()=>{this.dispatchEvent(new CustomEvent("change",{detail:{value:this.formattedValue},bubbles:!0}))};get stepValues(){return this.steps?this.steps.split(",").map(t=>Number(t.trim())).filter(t=>!isNaN(t)).sort((t,e)=>t-e):null}get lower(){const t=String(this.value).split(",");return Number(t[0])||0}get upper(){const t=String(this.value).split(",");return t.length>1?Number(t[1]):this.max}get percentage(){return(this.lower-this.min)/(this.max-this.min)*100}get upperPercentage(){return(this.upper-this.min)/(this.max-this.min)*100}formatValue=t=>{if(!this.format)return String(t);const e=this.format,i=e.match(/0([^0]?)0+/);if(!i)return e.replace("0",String(Math.round(t)));const s=i[0].indexOf(i[1])>0?i[1]:"",r=s?i[0].split(s)[1].length:0,a=t.toFixed(r);return e.replace(i[0],a)};snapToNearest=t=>{const e=this.stepValues;if(!e||0===e.length)return s(t,this.min,this.max);let i=e[0],r=Math.abs(t-i);for(let s=1;s<e.length;s++){const a=Math.abs(t-e[s]);a<r&&(i=e[s],r=a)}return i};ratioFromEvent=t=>{const e=this.shadowRoot.querySelector("#track").getBoundingClientRect();return this.vertical?s(1-(t.clientY-e.top)/e.height,0,1):s((t.clientX-e.left)/e.width,0,1)};valueFromEvent=t=>{const e=this.min+this.ratioFromEvent(t)*(this.max-this.min);return this.snapToNearest(e)};setValue=t=>{if(this.disabled)return;const e=s(t,this.min,this.max),i=this.snapToNearest(e);if(this.isRange){if(i>this.upper)return;i!==this.lower&&(this.value=`${i},${this.upper}`,this.dispatchChange())}else i!==this.lower&&(this.value=String(i),this.dispatchChange())};setUpper=t=>{if(this.disabled||!this.isRange)return;const e=s(t,this.min,this.max),i=this.snapToNearest(e);i<this.lower||i!==this.upper&&(this.value=`${this.lower},${i}`,this.dispatchChange())};closestThumb=t=>{if(!this.isRange)return"lower";return Math.abs(t-this.lower)<=Math.abs(t-this.upper)?"lower":"upper"};stepIncrement=(t,e)=>{const i=this.stepValues;if(i&&i.length>0){const s=i.indexOf(t);if(e>0){if(s>=0&&s<i.length-1)return i[s+1];if(-1===s)return i.find(e=>e>t)??i[i.length-1]}else{if(s>0)return i[s-1];if(-1===s)return[...i].reverse().find(e=>e<t)??i[0]}return t}return t+e};handleTrackClick=t=>{if(this.disabled)return;const e=this.valueFromEvent(t);this.isRange&&"upper"===this.closestThumb(e)?this.setUpper(e):this.setValue(e)};handleThumbDown=(t,e)=>{if(this.disabled)return;e.preventDefault(),e.stopPropagation(),this.#t=t,this.requestUpdate();const i=t=>{const e=t.touches?t.touches[0]:t,i=this.valueFromEvent(e);"upper"===this.#t?this.setUpper(i):this.setValue(i)},s=()=>{this.#t=null,this.requestUpdate(),window.removeEventListener("mousemove",i),window.removeEventListener("mouseup",s),window.removeEventListener("touchmove",i),window.removeEventListener("touchend",s)};window.addEventListener("mousemove",i),window.addEventListener("mouseup",s),window.addEventListener("touchmove",i),window.addEventListener("touchend",s)};handleKeyDown=t=>{if(this.disabled)return;const e=this.stepValues,i="ArrowRight"===t.key||"ArrowUp"===t.key,s="ArrowLeft"===t.key||"ArrowDown"===t.key;if(i||s){t.preventDefault();const e=i?1:-1;this.isRange&&"upper"===this.#t?this.setUpper(this.stepIncrement(this.upper,e)):this.setValue(this.stepIncrement(this.lower,e))}else"Home"===t.key?(t.preventDefault(),this.setValue(e?e[0]:this.min)):"End"===t.key&&(t.preventDefault(),this.isRange?this.setUpper(e?e[e.length-1]:this.max):this.setValue(e?e[e.length-1]:this.max))};renderHorizontal=()=>{const e=this.percentage,i=this.stepValues;if(this.isRange){const s=this.upperPercentage;return t`
        <div id="track" @click=${this.handleTrackClick}>
          <div id="fill" style="left:${e}%;width:${s-e}%"></div>
          ${i?i.map(e=>{const i=(e-this.min)/(this.max-this.min)*100;return t`<div class="step-dot" style="left:${i}%"></div>`}):""}
          <div
            class="thumb${"lower"===this.#t?" active":""}"
            style="left:${e}%"
            @mousedown=${t=>this.handleThumbDown("lower",t)}
            @touchstart=${t=>this.handleThumbDown("lower",t)}
          >${this.tooltip&&"lower"===this.#t?t`<div class="tooltip">${this.formatValue(this.lower)}</div>`:""}</div>
          <div
            class="thumb${"upper"===this.#t?" active":""}"
            style="left:${s}%"
            @mousedown=${t=>this.handleThumbDown("upper",t)}
            @touchstart=${t=>this.handleThumbDown("upper",t)}
          >${this.tooltip&&"upper"===this.#t?t`<div class="tooltip">${this.formatValue(this.upper)}</div>`:""}</div>
        </div>
      `}return t`
      <div id="track" @click=${this.handleTrackClick}>
        <div id="fill" style="width:${e}%"></div>
        ${i?i.map(e=>{const i=(e-this.min)/(this.max-this.min)*100;return t`<div class="step-dot" style="left:${i}%"></div>`}):""}
        <div
          class="thumb${"lower"===this.#t?" active":""}"
          style="left:${e}%"
          @mousedown=${t=>this.handleThumbDown("lower",t)}
          @touchstart=${t=>this.handleThumbDown("lower",t)}
        >${this.tooltip&&"lower"===this.#t?t`<div class="tooltip">${this.formatValue(this.lower)}</div>`:""}</div>
      </div>
    `};renderVertical=()=>{const e=this.percentage,i=this.stepValues;if(this.isRange){const s=this.upperPercentage;return t`
        <div id="track" @click=${this.handleTrackClick}>
          <div id="fill" style="bottom:${e}%;height:${s-e}%"></div>
          ${i?i.map(e=>{const i=(e-this.min)/(this.max-this.min)*100;return t`<div class="step-dot" style="bottom:${i}%"></div>`}):""}
          <div
            class="thumb${"lower"===this.#t?" active":""}"
            style="bottom:${e}%"
            @mousedown=${t=>this.handleThumbDown("lower",t)}
            @touchstart=${t=>this.handleThumbDown("lower",t)}
          >${this.tooltip&&"lower"===this.#t?t`<div class="tooltip">${this.formatValue(this.lower)}</div>`:""}</div>
          <div
            class="thumb${"upper"===this.#t?" active":""}"
            style="bottom:${s}%"
            @mousedown=${t=>this.handleThumbDown("upper",t)}
            @touchstart=${t=>this.handleThumbDown("upper",t)}
          >${this.tooltip&&"upper"===this.#t?t`<div class="tooltip">${this.formatValue(this.upper)}</div>`:""}</div>
        </div>
      `}return t`
      <div id="track" @click=${this.handleTrackClick}>
        <div id="fill" style="height:${e}%"></div>
        ${i?i.map(e=>{const i=(e-this.min)/(this.max-this.min)*100;return t`<div class="step-dot" style="bottom:${i}%"></div>`}):""}
        <div
          class="thumb${"lower"===this.#t?" active":""}"
          style="bottom:${e}%"
          @mousedown=${t=>this.handleThumbDown("lower",t)}
          @touchstart=${t=>this.handleThumbDown("lower",t)}
        >${this.tooltip&&"lower"===this.#t?t`<div class="tooltip">${this.formatValue(this.lower)}</div>`:""}</div>
      </div>
    `};render(){return t`
      ${this.vertical?this.renderVertical():this.renderHorizontal()}
      <div id="label"><slot></slot></div>
    `}static styles=e`
    :host {
      --track_height: 6px;
      --track_background: var(--c_border);
      --track_radius: 99999px;
      --fill_background: var(--c_primary);
      --thumb_size: 20px;
      --thumb_background: var(--c_primary);
      --thumb_border: 2px solid white;
      --thumb_shadow: var(--focus_shadow);
      --step_dot_size: 8px;
      --step_dot_background: var(--c_bg__alt);
      --step_dot_border: 1px solid var(--c_border);
      --vertical_height: 10rem;

      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }
    :host([vertical]) {
      flex-direction: column;
      width: auto;
      display: inline-flex;
    }
    #track {
      flex: 1;
      height: var(--track_height);
      background: var(--track_background);
      border-radius: var(--track_radius);
      position: relative;
      margin: 0 calc(var(--thumb_size) / 2);
    }
    :host([vertical]) #track {
      height: auto;
      width: var(--track_height);
      min-height: var(--vertical_height);
      margin: calc(var(--thumb_size) / 2) 0;
    }
    #fill {
      background: var(--fill_background);
      border-radius: var(--track_radius);
      pointer-events: none;
    }
    :host(:not([vertical])) #fill {
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    :host([vertical]) #fill {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .thumb {
      width: var(--thumb_size);
      height: var(--thumb_size);
      background: var(--thumb_background);
      border: var(--thumb_border);
      border-radius: 50%;
      position: absolute;
      box-shadow: 0 0 0 transparent;
      cursor: grab;
      transition: box-shadow 0.15s;
      z-index: 1;
    }
    :host(:not([vertical])) .thumb {
      top: 50%;
      transform: translate(-50%, -50%);
    }
    :host([vertical]) .thumb {
      left: 50%;
      transform: translate(-50%, 50%);
    }
    .thumb:active,
    .thumb.active {
      cursor: grabbing;
      box-shadow: var(--focus_shadow);
    }
    .tooltip {
      position: absolute;
      background: var(--c_text);
      color: var(--c_bg);
      padding: 0.15rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      white-space: nowrap;
      pointer-events: none;
      line-height: 1.2;
    }
    :host(:not([vertical])) .tooltip {
      bottom: calc(100% + 6px);
      left: 50%;
      transform: translateX(-50%);
    }
    :host([vertical]) .tooltip {
      right: calc(100% + 6px);
      top: 50%;
      transform: translateY(-50%);
    }
    .step-dot {
      width: var(--step_dot_size);
      height: var(--step_dot_size);
      background: var(--step_dot_background);
      border: var(--step_dot_border);
      border-radius: 50%;
      position: absolute;
      pointer-events: none;
    }
    :host(:not([vertical])) .step-dot {
      top: 50%;
      transform: translate(-50%, -50%);
    }
    :host([vertical]) .step-dot {
      left: 50%;
      transform: translate(-50%, 50%);
    }
    #label {
      font-size: 0.875rem;
    }
    #label:empty {
      display: none;
    }
  `}customElements.define("k-slider",r);