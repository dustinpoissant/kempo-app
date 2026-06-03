import{html as t,css as e}from"../lit-all.min.js";import a from"./ShadowComponent.js";export default class s extends a{static properties={value:{type:String,reflect:!0},allowedTags:{type:String,reflect:!0,attribute:"allowed-tags"},disallowedTags:{type:String,reflect:!0,attribute:"disallowed-tags"},disabled:{type:Boolean,reflect:!0}};constructor(){super(),this.value="",this.allowedTags="",this.disallowedTags="",this.disabled=!1}firstUpdated(){super.firstUpdated(),this.renderTags()}updated(t){if(super.updated(t),t.has("value")){const e=t.get("value"),a=this.validateTags();a!==this.value?this.value=a:(this.dispatchEvent(new CustomEvent("change",{detail:{oldValue:e,newValue:this.value},bubbles:!0})),this.renderTags())}if(t.has("allowedTags")||t.has("disallowedTags")){const e=t.get("allowedTags")||t.get("disallowedTags"),a=this.allowedTags||this.disallowedTags,s=this.validateTags();if(s!==this.value)this.value=s;else{const s=t.has("allowedTags")?"allowedtagschange":"disallowedtagschange";this.dispatchEvent(new CustomEvent(s,{detail:{oldValue:e,newValue:a},bubbles:!0})),this.renderTags()}}}handleInputChange=()=>{if(this.disabled)return;const t=this.shadowRoot.getElementById("tagsInput"),e=t.value.trim();e&&(this.addTag(e),t.value="")};handleInputInput=t=>{if(!this.disabled&&(","===t.data||"insertFromPaste"===t.inputType)){const t=this.shadowRoot.getElementById("tagsInput"),e=t.value.split(",").filter(t=>!!t.trim());e.length&&(e.forEach(t=>this.addTag(t.trim())),t.value="")}};async renderTags(){await this.updateComplete;const t=this.shadowRoot.getElementById("tags");t.innerHTML="",this.value&&this.value.split(",").forEach(e=>{const a=new i(e.trim(),this);t.appendChild(a)})}addTag(t){const e=new Set(this.value.split(",").filter(t=>!!t.trim()));e.add(t.trim()),this.value=[...e].filter(t=>!!t).join(","),this.dispatchEvent(new CustomEvent("addtag",{detail:{tag:t},bubbles:!0}))}removeTag(t){const e=new Set(this.value.split(",").filter(t=>!!t.trim()));e.delete(t),this.value=[...e].join(","),this.dispatchEvent(new CustomEvent("removetag",{detail:{tag:t},bubbles:!0}))}validateTags(){return this.value.split(",").map(t=>t.trim()).map(t=>{const e=new Set(this.allowedTags.split(",").filter(t=>!!t.trim()));if(e.size)return e.has(t)?t:"";const a=new Set(this.disallowedTags.split(",").filter(t=>!!t.trim()));return a.size&&a.has(t)?"":t}).filter(t=>!!t).join(",")}static styles=e`
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

		#tagsInput {
			display: inline-block;
			min-width: 5rem;
			width: auto;
			max-width: 100%;
			background-color: transparent;
			color: inherit;
			border: 0 solid transparent;
			margin: var(--spacer_q);
			padding: var(--spacer_q) 0;
			border-radius: 0;
			transition: none;
			box-shadow: 0 0 0 transparent;
		}
	`;render(){return t`
			<label for="tagsInput">
				<slot></slot>
				<div id="tagsHolder">
					<span id="tags"></span>
					<input 
						id="tagsInput"
						?disabled=${this.disabled}
						@change=${this.handleInputChange}
						@input=${this.handleInputInput}
					/>
				</div>
			</label>
		`}}class i extends a{constructor(t,e){super(),this.tag=t,this.tagsComponent=e,this.innerHTML=t}handleClick=()=>{this.tagsComponent.disabled||this.tagsComponent.removeTag(this.tag)};static styles=e`
		:host {
			display: inline-block;
			width: min-content;
			margin: var(--spacer_q);
			padding: var(--spacer_q) var(--spacer_h);
			border: 1px solid var(--c_border);
			border-radius: var(--radius);
			cursor: pointer;
		}

		:host(:hover) {
			text-decoration: line-through;
		}
	`;render(){return t`<span @click=${this.handleClick}><slot></slot></span>`}}customElements.define("k-tags",s),customElements.define("k-tag",i);