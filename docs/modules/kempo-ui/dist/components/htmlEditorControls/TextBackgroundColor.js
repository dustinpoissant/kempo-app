import DropdownControl from"./DropdownControl.js";import{html,css}from"../../lit-all.min.js";import"../Icon.js";export default class TextBackgroundColor extends DropdownControl{static properties={editorMode:{type:String,state:!0},colors:{type:String},disableRemove:{type:Boolean,attribute:"disable-remove"},disablePicker:{type:Boolean,attribute:"disable-picker"}};static styles=[DropdownControl.styles,css`
			.dropdown-content {
				padding: 8px;
				min-width: 200px;
			}

			.remove-btn {
				width: 100%;
				padding: 8px;
				margin-bottom: 8px;
				border: 1px solid var(--border-color, #ccc);
				background: var(--background-color, white);
				cursor: pointer;
				border-radius: 4px;
			}

			.remove-btn:hover {
				background: var(--hover-background-color, #f5f5f5);
			}

			.color-swatches {
				display: grid;
			grid-template-columns: repeat(6, 1fr);
			}

			.color-swatch {
				width: 32px;
				height: 32px;
				border: 1px solid var(--border-color, #ccc);
				cursor: pointer;
				border-radius: 4px;
			}

			.color-swatch:hover {
				border-color: var(--primary-color, #007acc);
				box-shadow: 0 0 4px rgba(0, 122, 204, 0.3);
			}

			.picker-row {
				display: flex;
				align-items: center;
				gap: 8px;
			}

			.picker-row label {
				flex-shrink: 0;
			}

			.picker-row input[type="color"] {
				flex: 1;
				height: 32px;
				border: 1px solid var(--border-color, #ccc);
				border-radius: 4px;
				cursor: pointer;
			}
		`];constructor(){super(),this.colors="#ffff00,#00ffff,#ff66ff,#99ff99,#ffcc99,#ff9999,#cccccc,#ffffff,#ffffcc,#ccffff,#ffccff,#ccffcc",this.disableRemove=!1,this.disablePicker=!1,this.icon="format_color_fill"}connectedCallback(){super.connectedCallback(),this.updateEditorMode(),this.editor?.addEventListener("mode-changed",()=>this.updateEditorMode())}handleRemove=o=>{o.preventDefault(),o.stopPropagation(),this.editor&&this.editor.removeTextBackgroundColor(),this.opened=!1};handleSwatchClick=o=>{o.preventDefault(),o.stopPropagation();const e=o.target.style.backgroundColor;if(this.editor&&e){const o=e.match(/\d+/g),t=o?"#"+o.map(o=>parseInt(o).toString(16).padStart(2,"0")).join(""):e;this.editor.setTextBackgroundColor(t)}this.opened=!1};handlePickerChange=o=>{o.preventDefault(),o.stopPropagation();const e=o.target.value;this.editor&&e&&this.editor.setTextBackgroundColor(e),this.opened=!1};updateEditorMode(){this.editor&&(this.editorMode=this.editor.mode)}getColorArray(){return this.colors.split(",").map(o=>o.trim()).filter(o=>o)}render(){this.hidden="code"===this.editorMode;const o=this.getColorArray();return html`
			<k-dropdown 
				?opened=${this.opened}
				@opened=${this.handleOpened}
				@closed=${this.handleClosed}
			>
				<button 
					slot="trigger" 
					class="${this.buttonClasses}"
				>
					<k-icon name="format_color_fill"></k-icon>
				</button>
				
				<div class="dropdown-content">
					${this.disableRemove?"":html`
						<button class="remove-btn" @click=${this.handleRemove}>
							Remove Color
						</button>
					`}
					
					<div class="color-swatches">
						${o.map(o=>html`
							<button 
								class="color-swatch" 
								style="background-color: ${o}"
								@click=${this.handleSwatchClick}
							></button>
						`)}
					</div>

					${this.disablePicker?"":html`
						<div class="picker-row">
							<label>Custom:</label>
							<input 
								type="color" 
								@input=${this.handlePickerChange}
							/>
						</div>
					`}
				</div>
			</k-dropdown>
		`}}customElements.define("k-hec-text-background-color",TextBackgroundColor);