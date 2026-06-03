import{html as e,css as t}from"../lit-all.min.js";import s from"./ShadowComponent.js";import i from"../utils/debounce.js";import"./Option.js";export default class o extends s{static formAssociated=!0;static properties={value:{type:String,reflect:!0},name:{type:String,reflect:!0},placeholder:{type:String},opened:{type:Boolean,reflect:!0},searching:{type:Boolean,reflect:!0},required:{type:Boolean,reflect:!0},requireMatch:{type:Boolean,reflect:!0,attribute:"require-match"},disabled:{type:Boolean,reflect:!0},debounceMs:{type:Number,attribute:"debounce-ms"},maxVisible:{type:Number,attribute:"max-visible"},noResultsMessage:{type:String,attribute:"no-results-message"},emptyMessage:{type:String,attribute:"empty-message"}};#e=-1;#t=[];constructor(){super(),this.internals=this.attachInternals(),this.value="",this.name="",this.placeholder="",this.opened=!1,this.searching=!1,this.required=!1,this.requireMatch=!1,this.disabled=!1,this.debounceMs=300,this.maxVisible=8,this.noResultsMessage="No Matches",this.emptyMessage="Type to search...",this.#s(300)}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.handleDocumentClick),this.#i()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.handleDocumentClick)}childrenUpdated(){this.#i()}updated(e){super.updated(e),e.has("debounceMs")&&this.#s(this.debounceMs),(e.has("value")||e.has("required")||e.has("requireMatch"))&&this.#o()}formResetCallback(){this.value="",this.#o()}formStateRestoreCallback(e){this.value=e}handleInput=e=>{this.value=e.target.value,this.opened=!0,this.#e=-1,this.#a(this.value)};handleKeydown=e=>{const t=this.#n;if("ArrowDown"===e.key){if(e.preventDefault(),!this.opened)return void(this.opened=!0);this.#e=Math.min(this.#e+1,t.length-1),this.requestUpdate(),this.#r()}else"ArrowUp"===e.key?(e.preventDefault(),this.#e=Math.max(this.#e-1,0),this.requestUpdate(),this.#r()):"Enter"===e.key?(e.preventDefault(),this.#e>=0&&this.#e<t.length&&this.#l(t[this.#e])):"Escape"===e.key?(e.preventDefault(),this.opened=!1,this.#e=-1):"Tab"===e.key&&(this.opened=!1,this.#e=-1)};handleDocumentClick=e=>{e.composedPath().includes(this)||(this.opened=!1,this.#e=-1)};handleFocus=()=>{this.opened=!0};handleOptionClick=e=>{const t=Number(e.currentTarget.dataset.index);this.#l(this.#n[t])};setOptions(e){return[...this.querySelectorAll("k-option")].forEach(e=>e.remove()),e.forEach(e=>{const t=document.createElement("k-option");"object"==typeof e?(t.setAttribute("value",e.value??e.label),t.textContent=e.label):t.textContent=e,this.appendChild(t)}),this}clear(){return this.value="",this.opened=!1,this.#e=-1,this.#o(),this}#s(e){this.#a=i(e=>{this.dispatchEvent(new CustomEvent("search",{detail:{value:e},bubbles:!0,composed:!0}))},e)}#a=()=>{};#i(){this.#t=[...this.querySelectorAll("k-option")].map(e=>({label:e.label,value:e.value})),this.requestUpdate()}#l(e){this.value=e.label,this.opened=!1,this.#e=-1,this.#o(),this.dispatchEvent(new CustomEvent("select",{detail:{value:e.value,label:e.label},bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("change",{bubbles:!0}))}#o(){const e=this.#t.find(e=>e.label===this.value);this.internals.setFormValue(e?e.value:this.value),this.required&&!this.value?this.internals.setValidity({valueMissing:!0},"Please select a value.",this.shadowRoot?.querySelector("input")):this.requireMatch&&this.value&&!e?this.internals.setValidity({customError:!0},"Please select a valid option.",this.shadowRoot?.querySelector("input")):this.internals.setValidity({})}#r(){this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".option.focused")?.scrollIntoView({block:"nearest"})})}get#d(){const e=(this.value||"").toLowerCase();return e?this.#t.filter(t=>t.label.toLowerCase().includes(e)):this.#t}get#n(){return this.#d.slice(0,this.maxVisible)}render(){const t=this.#n,s=this.#d.length>this.maxVisible;return e`
			<slot style="display:none"></slot>
			<input
				type="text"
				.value=${this.value}
				placeholder=${this.placeholder}
				?disabled=${this.disabled}
				@input=${this.handleInput}
				@keydown=${this.handleKeydown}
				@focus=${this.handleFocus}
				autocomplete="off"
			/>
			${this.opened?e`
				<div id="menu">
					${t.map((t,s)=>e`
						<div
							class="option ${s===this.#e?"focused":""}"
							data-index=${s}
							@click=${this.handleOptionClick}
						>${t.label}</div>
					`)}
					${s&&!this.searching?e`
						<div class="more">${this.#d.length-this.maxVisible} more...</div>
					`:""}
					${0!==t.length||this.searching?"":e`
						<div class="no-results">${this.value?this.noResultsMessage:this.emptyMessage}</div>
					`}
					${this.searching?e`
						<div class="searching">
							<k-spinner size="xs"></k-spinner>
							<span>Searching...</span>
						</div>
					`:""}
				</div>
			`:""}
		`}static styles=t`
		:host {
			display: block;
			position: relative;
		}
		:host([disabled]) {
			opacity: 0.5;
			pointer-events: none;
		}
		input {
			width: 100%;
			box-sizing: border-box;
			padding: var(--spacer_h) var(--spacer);
			border: 1px solid var(--c_border);
			border-radius: var(--radius);
			background: var(--c_bg);
			color: var(--tc);
			font: inherit;
			outline: none;
			transition: border-color var(--animation_ms);
		}
		input:focus {
			border-color: var(--c_primary);
		}
		#menu {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			z-index: 30;
			max-height: 20rem;
			min-width: var(--min-width, 8rem);
			overflow-y: auto;
			background: var(--c_bg);
			border: 1px solid var(--c_border);
			border-radius: var(--radius);
			box-shadow: var(--drop_shadow);
			margin-top: 0.25rem;
		}
		.option {
			padding: var(--spacer_h) var(--spacer);
			cursor: pointer;
			transition: background var(--animation_ms);
		}
		.option:hover,
		.option.focused {
			background: var(--c_bg__alt);
		}
		.no-results,
		.more {
			padding: var(--spacer_h) var(--spacer);
			color: var(--tc_muted);
			font-style: italic;
		}
		.searching {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			padding: var(--spacer_h) var(--spacer);
			color: var(--tc_muted);
			border-top: 1px solid var(--c_border);
		}
	`}customElements.define("k-combobox",o);