import{html as t,css as e}from"../lit-all.min.js";import s from"./ShadowComponent.js";const a=Symbol("debounceTimer"),i=Symbol("suggestion"),n=Symbol("suggestionSuppressed");export default class o extends s{static properties={value:{type:String,reflect:!0},allowedTags:{type:String,reflect:!0,attribute:"allowed-tags"},disallowedTags:{type:String,reflect:!0,attribute:"disallowed-tags"},suggestionDebounce:{type:Number,reflect:!0,attribute:"suggestion-debounce"},disabled:{type:Boolean,reflect:!0}};constructor(){super(),this.value="",this.allowedTags="",this.disallowedTags="",this.suggestionDebounce=300,this.disabled=!1,this.getSuggestions=null,this[i]="",this[n]=!1}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this[a])}firstUpdated(){super.firstUpdated(),this.renderTags()}updated(t){if(super.updated(t),t.has("value")){const e=t.get("value"),s=this.validateTags();s!==this.value?this.value=s:(this.dispatchEvent(new CustomEvent("change",{detail:{oldValue:e,newValue:this.value},bubbles:!0})),this.renderTags())}if(t.has("allowedTags")||t.has("disallowedTags")){const e=t.get("allowedTags")||t.get("disallowedTags"),s=this.allowedTags||this.disallowedTags,a=this.validateTags();if(a!==this.value)this.value=a;else{const a=t.has("allowedTags")?"allowedtagschange":"disallowedtagschange";this.dispatchEvent(new CustomEvent(a,{detail:{oldValue:e,newValue:s},bubbles:!0})),this.renderTags()}}}handleInputChange=()=>{if(this.disabled)return;const t=this.shadowRoot.getElementById("tagsInput"),e=t.value.trim();e&&(this.addTag(e),t.value="")};handleInputInput=t=>{if(this.disabled)return;const e=this.shadowRoot.getElementById("tagsInput");if(","===t.data||"insertFromPaste"===t.inputType){const t=e.value.split(",").filter(t=>!!t.trim());return t.length&&(t.forEach(t=>this.addTag(t.trim())),e.value=""),void this.clearSuggestion()}this.clearSuggestion(),this[n]=!1,this.requestSuggestions(e.value)};handleInputKeydown=t=>{if(this.disabled)return;const e=this.shadowRoot.getElementById("tagsInput"),s=!!this[i];if("Enter"===t.key||"Tab"===t.key){const a=(s?this[i]:e.value).trim();a&&(t.preventDefault(),this.addTag(a),e.value="",this.clearSuggestion(),this[n]=!1)}else"Backspace"!==t.key&&"Escape"!==t.key||!s||(t.preventDefault(),this.clearSuggestion(),this[n]=!0)};async renderTags(){await this.updateComplete;const t=this.shadowRoot.getElementById("tags");t.innerHTML="",this.value&&this.value.split(",").forEach(e=>{const s=new r(e.trim(),this);t.appendChild(s)})}requestSuggestions(t){clearTimeout(this[a]),this.getSuggestions&&t.trim()&&!this[n]&&(this[a]=setTimeout(()=>{const e=this.getSuggestions(t,e=>this.applySuggestions(t,e));e&&"function"==typeof e.then?e.then(e=>this.applySuggestions(t,e)):Array.isArray(e)&&this.applySuggestions(t,e)},this.suggestionDebounce))}applySuggestions(t,e){const s=this.shadowRoot?.getElementById("tagsInput");if(!s||this[n]||s.value!==t||!Array.isArray(e))return;const a=e.find(e=>"string"==typeof e&&e.length>t.length&&e.toLowerCase().startsWith(t.toLowerCase()));if(!a)return void this.clearSuggestion();this[i]=a;const o=this.shadowRoot.getElementById("ghost");o.innerHTML="";const r=document.createElement("span");r.textContent=t;const l=document.createElement("span");l.className="suffix",l.textContent=a.slice(t.length),o.appendChild(r),o.appendChild(l)}clearSuggestion(){clearTimeout(this[a]),this[i]="";const t=this.shadowRoot?.getElementById("ghost");t&&(t.innerHTML="")}addTag(t){const e=new Set(this.value.split(",").filter(t=>!!t.trim()));e.add(t.trim()),this.value=[...e].filter(t=>!!t).join(","),this.dispatchEvent(new CustomEvent("addtag",{detail:{tag:t},bubbles:!0}))}removeTag(t){const e=new Set(this.value.split(",").filter(t=>!!t.trim()));e.delete(t),this.value=[...e].join(","),this.dispatchEvent(new CustomEvent("removetag",{detail:{tag:t},bubbles:!0}))}validateTags(){return this.value.split(",").map(t=>t.trim()).map(t=>{const e=new Set(this.allowedTags.split(",").filter(t=>!!t.trim()));if(e.size)return e.has(t)?t:"";const s=new Set(this.disallowedTags.split(",").filter(t=>!!t.trim()));return s.size&&s.has(t)?"":t}).filter(t=>!!t).join(",")}static styles=e`
		:host {
			display: block;
		}
		:host([disabled]) {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}
		#tagsHolder {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			width: 100%;
			background-color: var(--input_bg);
			color: var(--input_tc);
			border: var(--input_border_width) solid var(--c_border);
			padding: var(--spacer_q);
			margin-bottom: var(--spacer);
			border-radius: var(--radius);
			outline: none;
			transition: box-shadow var(--animation_ms);
			cursor: default;
		}

		#tagsHolder:focus-within {
			box-shadow: var(--focus_shadow);
		}

		#tags {
			display: contents;
		}

		#inputWrap {
			position: relative;
			display: inline-flex;
			max-width: 100%;
			margin: var(--spacer_q);
		}

		#tagsInput {
			display: inline-block;
			min-width: 5rem;
			width: auto;
			max-width: 100%;
			font: inherit;
			background-color: transparent;
			color: inherit;
			border: 0 solid transparent;
			margin: 0;
			padding: var(--spacer_q) 0;
			border-radius: 0;
			transition: none;
			box-shadow: 0 0 0 transparent;
			position: relative;
			z-index: 1;
		}

		#ghost {
			position: absolute;
			top: 0;
			left: 0;
			padding: var(--spacer_q) 0;
			font: inherit;
			white-space: pre;
			pointer-events: none;
			overflow: hidden;
			max-width: 100%;
			color: transparent;
			z-index: 0;
		}

		#ghost .suffix {
			color: var(--tc_muted, #666);
		}
	`;render(){return t`
			<label for="tagsInput">
				<slot></slot>
				<div id="tagsHolder">
					<span id="tags"></span>
					<span id="inputWrap">
						<span id="ghost"></span>
						<input
							id="tagsInput"
							?disabled=${this.disabled}
							@change=${this.handleInputChange}
							@input=${this.handleInputInput}
							@keydown=${this.handleInputKeydown}
						/>
					</span>
				</div>
			</label>
		`}}class r extends s{constructor(t,e){super(),this.tag=t,this.tagsComponent=e,this.innerHTML=t}handleClick=()=>{this.tagsComponent.disabled||this.tagsComponent.removeTag(this.tag)};static styles=e`
		:host {
			display: inline-block;
			max-width: 100%;
			margin: var(--spacer_q);
			padding: var(--spacer_q) var(--spacer_h);
			border: 1px solid var(--c_border);
			border-radius: var(--radius);
			cursor: pointer;
			box-sizing: border-box;
		}

		:host(:hover) {
			text-decoration: line-through;
		}
	`;render(){return t`<span @click=${this.handleClick}><slot></slot></span>`}}customElements.define("k-tags",o),customElements.define("k-tag",r);