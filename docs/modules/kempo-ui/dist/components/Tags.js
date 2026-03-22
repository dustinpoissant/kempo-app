import{html,css}from"../lit-all.min.js";import ShadowComponent from"./ShadowComponent.js";export default class Tags extends ShadowComponent{static properties={value:{type:String,reflect:!0},allowedTags:{type:String,reflect:!0,attribute:"allowed-tags"},disallowedTags:{type:String,reflect:!0,attribute:"disallowed-tags"}};constructor(){super(),this.value="",this.allowedTags="",this.disallowedTags=""}firstUpdated(){super.firstUpdated(),this.renderTags()}updated(t){if(super.updated(t),t.has("value")){const a=t.get("value"),e=this.validateTags();e!==this.value?this.value=e:(this.dispatchEvent(new CustomEvent("change",{detail:{oldValue:a,newValue:this.value},bubbles:!0})),this.renderTags())}if(t.has("allowedTags")||t.has("disallowedTags")){const a=t.get("allowedTags")||t.get("disallowedTags"),e=this.allowedTags||this.disallowedTags,s=this.validateTags();if(s!==this.value)this.value=s;else{const s=t.has("allowedTags")?"allowedtagschange":"disallowedtagschange";this.dispatchEvent(new CustomEvent(s,{detail:{oldValue:a,newValue:e},bubbles:!0})),this.renderTags()}}}handleInputChange=()=>{const t=this.shadowRoot.getElementById("tagsInput"),a=t.value.trim();a&&(this.addTag(a),t.value="")};handleInputInput=t=>{if(","===t.data||"insertFromPaste"===t.inputType){const t=this.shadowRoot.getElementById("tagsInput"),a=t.value.split(",").filter(t=>!!t.trim());a.length&&(a.forEach(t=>this.addTag(t.trim())),t.value="")}};async renderTags(){await this.updateComplete;const t=this.shadowRoot.getElementById("tags");t.innerHTML="",this.value&&this.value.split(",").forEach(a=>{const e=new Tag(a.trim(),this);t.appendChild(e)})}addTag(t){const a=new Set(this.value.split(",").filter(t=>!!t.trim()));a.add(t.trim()),this.value=[...a].filter(t=>!!t).join(","),this.dispatchEvent(new CustomEvent("addtag",{detail:{tag:t},bubbles:!0}))}removeTag(t){const a=new Set(this.value.split(",").filter(t=>!!t.trim()));a.delete(t),this.value=[...a].join(","),this.dispatchEvent(new CustomEvent("removetag",{detail:{tag:t},bubbles:!0}))}validateTags(){return this.value.split(",").map(t=>t.trim()).map(t=>{const a=new Set(this.allowedTags.split(",").filter(t=>!!t.trim()));if(a.size)return a.has(t)?t:"";const e=new Set(this.disallowedTags.split(",").filter(t=>!!t.trim()));return e.size&&e.has(t)?"":t}).filter(t=>!!t).join(",")}static styles=css`
		:host {
			display: block;

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
	`;render(){return html`
			<label for="tagsInput">
				<slot></slot>
				<div id="tagsHolder">
					<span id="tags"></span>
					<input 
						id="tagsInput" 
						@change=${this.handleInputChange}
						@input=${this.handleInputInput}
					/>
				</div>
			</label>
		`}}class Tag extends ShadowComponent{constructor(t,a){super(),this.tag=t,this.tagsComponent=a,this.innerHTML=t}handleClick=()=>{this.tagsComponent.removeTag(this.tag)};static styles=css`
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
	`;render(){return html`<span @click=${this.handleClick}><slot></slot></span>`}}customElements.define("k-tags",Tags),customElements.define("k-tag",Tag);