import{html as e,css as t}from"../lit-all.min.js";import a from"./ShadowComponent.js";const i=["January","February","March","April","May","June","July","August","September","October","November","December"],s=["Su","Mo","Tu","We","Th","Fr","Sa"];export default class r extends a{static formAssociated=!0;static properties={value:{type:String,reflect:!0},name:{type:String,reflect:!0},mode:{type:String,reflect:!0},min:{type:String,reflect:!0},max:{type:String,reflect:!0},disabled:{type:Boolean,reflect:!0},required:{type:Boolean,reflect:!0},view:{state:!0},hoverDate:{state:!0}};constructor(){super(),this.internals=this.attachInternals(),this.value="",this.name="",this.mode="single",this.min="",this.max="",this.disabled=!1,this.required=!1;const e=new Date;this.view=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`,this.hoverDate=null}#e=!1;updated(e){if(super.updated(e),this.internals.setFormValue(this.value),this.required&&!this.value?this.internals.setValidity({valueMissing:!0},"Please select a date.",this.shadowRoot?.querySelector(".day")):this.internals.setValidity({}),e.has("value")&&void 0!==e.get("value")&&this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0})),e.has("value")&&this.value&&!this.#e){const e=this.fromIso(this.value.split(",")[0]);if(e){const t=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`;t!==this.view&&(this.view=t)}}this.#e=!1}get isRange(){return"range"===this.mode}get viewYear(){return Number(this.view.split("-")[0])}get viewMonth(){return Number(this.view.split("-")[1])-1}get parsed(){if(!this.value)return this.isRange?{start:null,end:null}:{date:null};if(this.isRange){const[e,t]=this.value.split(",");return{start:e?this.fromIso(e):null,end:t?this.fromIso(t):null}}return{date:this.fromIso(this.value)}}toIso=e=>e?`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`:"";fromIso=e=>{if(!e)return null;const[t,a,i]=e.split("-").map(Number);return isNaN(t)||isNaN(a)||isNaN(i)?null:new Date(t,a-1,i)};isSameDay=(e,t)=>!(!e||!t)&&(e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate());isWithinRange=(e,t,a)=>{if(!t||!a||!e)return!1;const i=e.getTime();return i>t.getTime()&&i<a.getTime()};resolveDate=e=>{if(!e)return null;const t=String(e).toLowerCase();if("today"===t||"tomorrow"===t||"yesterday"===t){const e=new Date;return e.setHours(0,0,0,0),"tomorrow"===t&&e.setDate(e.getDate()+1),"yesterday"===t&&e.setDate(e.getDate()-1),e}return this.fromIso(e)};get minDate(){return this.resolveDate(this.min)||this.fromIso("1900-01-01")}get maxDate(){if(this.max)return this.resolveDate(this.max);const e=new Date;return new Date(e.getFullYear()+10,11,31)}isDisabledDate=e=>{if(!e)return!1;const t=this.minDate;if(t&&e<t)return!0;const a=this.maxDate;return!!(a&&e>a)};get availableYears(){const e=this.minDate?.getFullYear()??1900,t=this.maxDate?.getFullYear()??(new Date).getFullYear()+10,a=[];for(let i=e;i<=t;i++)a.push(i);return a}isMonthDisabled=(e,t)=>{const a=new Date(e,t+1,0),i=new Date(e,t,1),s=this.minDate,r=this.maxDate;return!!(s&&a<s)||!!(r&&i>r)};get weekGrid(){const e=this.viewYear,t=this.viewMonth,a=new Date(e,t,1).getDay(),i=new Date(e,t,1-a),s=[];for(let e=0;e<6;e++){const t=[];for(let a=0;a<7;a++){const s=new Date(i);s.setDate(i.getDate()+7*e+a),t.push(s)}s.push(t)}return s}get monthLabel(){return`${i[this.viewMonth]} ${this.viewYear}`}prevMonth=()=>{const e=new Date(this.viewYear,this.viewMonth-1,1);this.view=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`};nextMonth=()=>{const e=new Date(this.viewYear,this.viewMonth+1,1);this.view=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`};goToMonth=(e,t)=>{this.view=`${e}-${String(t+1).padStart(2,"0")}`};goToToday=()=>{const e=new Date;this.view=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`};handleDayClick=e=>{if(!this.disabled&&!this.isDisabledDate(e))if(this.#e=!0,this.isRange){const{start:t,end:a}=this.parsed;this.value=!t||a?this.toIso(e):e<t?`${this.toIso(e)},${this.toIso(t)}`:`${this.toIso(t)},${this.toIso(e)}`}else this.value=this.toIso(e)};handleDayHover=e=>{this.isRange&&(this.hoverDate=e)};handleMouseLeave=()=>{this.isRange&&(this.hoverDate=null)};handleMonthChange=e=>{this.goToMonth(this.viewYear,Number(e.target.value))};handleYearChange=e=>{this.goToMonth(Number(e.target.value),this.viewMonth)};render(){const t=new Date,a=this.parsed,r=a.date,n=a.start,o=a.end,l=this.isRange&&n&&!o&&this.hoverDate?this.hoverDate:o,d=this.isRange&&n&&l&&n>l?l:n,h=this.isRange&&n&&l&&n>l?n:l;return e`
      <div class="header">
        <select
          class="month-select"
          aria-label="Month"
          ?disabled=${this.disabled}
          @change=${this.handleMonthChange}
        >
          ${i.map((t,a)=>e`
            <option
              value=${a}
              ?selected=${a===this.viewMonth}
              ?disabled=${this.isMonthDisabled(this.viewYear,a)}
            >${t}</option>
          `)}
        </select>
        <select
          class="year-select"
          aria-label="Year"
          ?disabled=${this.disabled}
          @change=${this.handleYearChange}
        >
          ${this.availableYears.map(t=>e`
            <option value=${t} ?selected=${t===this.viewYear}>${t}</option>
          `)}
        </select>
      </div>
      <div class="grid" @mouseleave=${this.handleMouseLeave}>
        <div class="row head">
          ${s.map(t=>e`<div class="dow">${t}</div>`)}
        </div>
        ${this.weekGrid.map(a=>e`
          <div class="row">
            ${a.map(a=>{const i=a.getMonth()!==this.viewMonth,s=this.isSameDay(a,t),n=!this.isRange&&this.isSameDay(a,r),l=this.isRange&&this.isSameDay(a,d),g=this.isRange&&this.isSameDay(a,h),u=this.isRange&&this.isWithinRange(a,d,h),c=this.isDisabledDate(a),v=["day",i?"outside":"",s?"today":"",n?"selected":"",l?"range-start":"",g&&!l?"range-end":"",u?"in-range":"",this.isRange&&!o&&(l||g||u)&&!n?"preview":"",c?"disabled":""].filter(Boolean).join(" ");return e`
                <button
                  type="button"
                  class="no-btn ${v}"
                  ?disabled=${c||this.disabled}
                  aria-selected=${n||l||g?"true":"false"}
                  @click=${()=>this.handleDayClick(a)}
                  @mouseenter=${()=>this.handleDayHover(a)}
                >${a.getDate()}</button>
              `})}
          </div>
        `)}
      </div>
    `}static styles=t`
    :host {
      --day_size: 2rem;
      --day_radius: var(--radius);
      --day_bg__selected: var(--c_primary);
      --day_tc__selected: white;
      --day_bg__range: var(--c_bg__alt);
      --day_bg__hover: var(--c_bg__alt);

      display: inline-block;
      border: 1px solid var(--c_border);
      border-radius: var(--radius);
      padding: 0.5rem;
      background: var(--c_bg);
      user-select: none;
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem;
      margin-bottom: 0.25rem;
    }
    .month-select,
    .year-select {
      font-weight: 600;
      width: auto;
    }
    .month-select {
      flex: 1;
    }
    .grid {
      display: flex;
      flex-direction: column;
    }
    .row {
      display: grid;
      grid-template-columns: repeat(7, var(--day_size));
    }
    .row.head {
      margin-bottom: 0.25rem;
    }
    .dow {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: var(--tc_muted);
      font-weight: 500;
      height: var(--day_size);
    }
    .day {
      appearance: none;
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--day_radius);
      width: var(--day_size);
      height: var(--day_size);
      cursor: pointer;
      color: var(--tc);
      font: inherit;
      font-size: 0.875rem;
      padding: 0;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background var(--animation_ms), color var(--animation_ms);
    }
    .day:hover:not(:disabled):not(.selected):not(.range-start):not(.range-end) {
      background: var(--day_bg__hover);
    }
    .day:focus-visible {
      outline: none;
      border-color: var(--c_primary);
      box-shadow: var(--focus_shadow);
      z-index: 1;
    }
    .day.outside {
      color: var(--tc_muted);
      opacity: 0.5;
    }
    .day.today {
      font-weight: 700;
      border-color: var(--c_primary);
    }
    .day.selected,
    .day.in-range,
    .day.range-start,
    .day.range-end {
      background: var(--day_bg__selected);
      color: var(--day_tc__selected);
      border-color: transparent;
    }
    .day.in-range {
      border-radius: 0;
    }
    .day.range-start:not(.range-end) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .day.range-end:not(.range-start) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .day.outside.in-range,
    .day.outside.range-start,
    .day.outside.range-end {
      opacity: 0.6;
    }
    .day.preview.in-range,
    .day.preview.range-start,
    .day.preview.range-end {
      opacity: 0.75;
    }
    .day:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  `}customElements.define("k-calendar",r);