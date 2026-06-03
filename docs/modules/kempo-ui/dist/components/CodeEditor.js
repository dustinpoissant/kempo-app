import{html as t,css as e}from"../lit-all.min.js";import o from"./ShadowComponent.js";import i from"../utils/formatCode.js";import{getCalculatedTheme as s,subscribeToTheme as a}from"../utils/theme.js";import r from"./controls/Control.js";export default class n extends o{static formAssociated=!0;static properties={name:{type:String,reflect:!0},value:{type:String,reflect:!0},language:{type:String,reflect:!0},monacoSrc:{type:String,attribute:"monaco-src"},controls:{type:String,reflect:!0},editorTheme:{type:String,attribute:"editor-theme",reflect:!0},hasTopToolbar:{type:Boolean,state:!0},hasBottomToolbar:{type:Boolean,state:!0},fullscreen:{type:Boolean,reflect:!0},wordWrap:{type:Boolean},minimapEnabled:{type:Boolean},disabled:{type:Boolean,reflect:!0},readonly:{type:Boolean,reflect:!0},required:{type:Boolean,reflect:!0}};constructor(){super(),this.internals=this.attachInternals(),this.name="",this.value="",this.language="javascript",this.monacoSrc="",this.controls="",this.hasTopToolbar=!1,this.hasBottomToolbar=!1,this.monacoEditor=null,this.skipValueSync=!1,this.editorTheme="auto",this.wordWrap=!0,this.minimapEnabled=!1,this.fontSize=14,this.fullscreen=!1,this.disabled=!1,this.readonly=!1,this.required=!1}connectedCallback(){super.connectedCallback(),this.hasAttribute("controlled")||this.setAttribute("controlled",""),this.hasAttribute("value")&&(this.value=this.getAttribute("value")),this.slotObserver=new MutationObserver(()=>this.updateToolbarVisibility()),this.slotObserver.observe(this,{childList:!0,subtree:!0}),this.updateToolbarVisibility()}disconnectedCallback(){super.disconnectedCallback(),this.slotObserver?.disconnect(),this.monacoEditor?.dispose(),this.unsubscribeTheme?.(),this.fullscreen&&this.exitFullscreen()}updateToolbarVisibility(){const t=new Set(Array.from(this.children).map(t=>t.getAttribute("slot"))),e=this.constructor.controlSets[this.controls]??null;this.hasTopToolbar=!(!e?.topLeft&&!e?.topRight)||["toolbar-top","toolbar-top-left","toolbar-top-right"].some(e=>t.has(e)),this.hasBottomToolbar=!(!e?.bottomLeft&&!e?.bottomRight)||["toolbar-bottom","toolbar-bottom-left","toolbar-bottom-right"].some(e=>t.has(e))}updated(t){if(super.updated(t),t.has("controls")&&(this.updateToolbarVisibility(),this.controls&&"none"!==this.controls&&this.loadControls()),t.has("value")&&!this.skipValueSync&&(this.monacoEditor&&this.monacoEditor.getValue()!==this.value&&this.monacoEditor.setValue(this.value),this.updateFormValue(),this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0}))),t.has("language")&&this.monacoEditor){const t=this.monacoEditor.getModel();t&&window.monaco.editor.setModelLanguage(t,this.language),this.dispatchEvent(new CustomEvent("language-changed",{detail:{language:this.language},bubbles:!0}))}t.has("editorTheme")&&this.monacoEditor&&(window.monaco.editor.setTheme(this.resolveMonacoTheme()),this.dispatchEvent(new CustomEvent("editor-theme-changed",{detail:{editorTheme:this.editorTheme},bubbles:!0}))),t.has("wordWrap")&&(this.monacoEditor?.updateOptions({wordWrap:this.wordWrap?"on":"off"}),this.dispatchEvent(new CustomEvent("word-wrap-changed",{detail:{wordWrap:this.wordWrap},bubbles:!0}))),t.has("minimapEnabled")&&(this.monacoEditor?.updateOptions({minimap:{enabled:this.minimapEnabled}}),this.dispatchEvent(new CustomEvent("minimap-changed",{detail:{minimapEnabled:this.minimapEnabled},bubbles:!0}))),t.has("fullscreen")&&(this.fullscreen||this.monacoEditor?.layout({width:0,height:0}),requestAnimationFrame(()=>this.monacoEditor?.layout())),(t.has("disabled")||t.has("readonly"))&&this.monacoEditor?.updateOptions({readOnly:this.disabled||this.readonly}),(t.has("value")||t.has("required")||t.has("disabled"))&&this.#t()}#t=()=>{this.disabled?this.internals.setValidity({}):this.required&&!(this.getValue()||"").trim()?this.internals.setValidity({valueMissing:!0},"Please fill out this field.",this.monacoContainer||this):this.internals.setValidity({})};async firstUpdated(){this.monacoContainer=this.shadowRoot.querySelector(".monaco-editor-container"),await this.initMonaco(),this.dispatchEvent(new CustomEvent("ready",{detail:{value:this.value},bubbles:!0}))}loadControls(){const t=this.constructor.controlSets[this.controls];t&&r.load(Object.values(t))}async initMonaco(){if(!this.monacoEditor){if(this.monacoInitPromise)return this.monacoInitPromise;this.monacoInitPromise=this._initMonaco(),await this.monacoInitPromise,this.monacoInitPromise=null}}async _initMonaco(){const t=this.monacoSrc||window.kempo?.monacoUrl||"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min";await new Promise((e,o)=>{if(window.monaco)return void e();if(window.require?.defined?.("vs/editor/editor.main"))return void e();const i=document.querySelector(`script[src="${t}/vs/loader.js"]`);if(i)return void i.addEventListener("load",()=>{window.require.config({paths:{vs:`${t}/vs`}}),window.require(["vs/editor/editor.main"],()=>e(),o)});const s=document.createElement("script");s.src=`${t}/vs/loader.js`,s.onload=()=>{window.require.config({paths:{vs:`${t}/vs`}}),window.require(["vs/editor/editor.main"],()=>e(),o)},s.onerror=o,document.head.appendChild(s)}),this.monacoEditor=window.monaco.editor.create(this.monacoContainer,{value:this.value,language:this.language,theme:this.resolveMonacoTheme(),minimap:{enabled:!1},wordWrap:"on",fontSize:14,scrollBeyondLastLine:!1,automaticLayout:!0,tabSize:2,padding:{top:8},readOnly:this.disabled||this.readonly});const e=document.querySelector('link[href*="monaco"][href*="editor.main.css"]');if(e){const t=document.createElement("link");t.rel="stylesheet",t.href=e.href,this.shadowRoot.appendChild(t)}this.unsubscribeTheme=a(()=>{this.monacoEditor&&"auto"===this.editorTheme&&window.monaco.editor.setTheme(this.resolveMonacoTheme())}),this.monacoEditor.onDidChangeModelContent(()=>{this.skipValueSync=!0,this.value=this.monacoEditor.getValue(),this.skipValueSync=!1,this.updateFormValue(),this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0})),this.dispatchEvent(new CustomEvent("input",{detail:{value:this.value},bubbles:!0}))})}updateFormValue(){this.internals.setFormValue(this.getValue())}formResetCallback(){this.value=""}formStateRestoreCallback(t){this.value=t}formDisabledCallback(t){this.disabled=t}getValue(){return this.monacoEditor?this.monacoEditor.getValue():this.value}setValue(t){return this.skipValueSync=!0,this.value=t,this.monacoEditor&&this.monacoEditor.setValue(t),this.updateFormValue(),this.skipValueSync=!1,this}clear(){return this.setValue("")}formatCode(){return this.monacoEditor?.getAction("editor.action.formatDocument")?.run(),this}selectAll(){if(!this.monacoEditor)return this;const t=this.monacoEditor.getModel();return t&&this.monacoEditor.setSelection(t.getFullModelRange()),this}getSelectedText(){return this.monacoEditor&&this.monacoEditor.getModel()?.getValueInRange(this.monacoEditor.getSelection())||""}focus(){return this.monacoEditor?.focus(),this}setLanguage(t){return this.language=t,this}setEditorTheme(t){return["auto","light","dark"].includes(t)&&(this.editorTheme=t),this}copyToClipboard(){return navigator.clipboard.writeText(this.getValue()),this}undo(){return this.monacoEditor?.trigger("toolbar","undo"),this}redo(){return this.monacoEditor?.trigger("toolbar","redo"),this}setWordWrap(t){return this.wordWrap=t,this}setMinimap(t){return this.minimapEnabled=t,this}toggleWordWrap(){return this.setWordWrap(!this.wordWrap)}toggleMinimap(){return this.setMinimap(!this.minimapEnabled)}openFind(){return this.monacoEditor?.getAction("actions.find")?.run(),this}increaseFontSize(){return this.fontSize=Math.min(this.fontSize+2,40),this.monacoEditor?.updateOptions({fontSize:this.fontSize}),this}decreaseFontSize(){return this.fontSize=Math.max(this.fontSize-2,8),this.monacoEditor?.updateOptions({fontSize:this.fontSize}),this}foldAll(){return this.monacoEditor?.getAction("editor.foldAll")?.run(),this}unfoldAll(){return this.monacoEditor?.getAction("editor.unfoldAll")?.run(),this}enterFullscreen(){return this.fullscreen=!0,document.body.classList.add("no-scroll"),this.dispatchEvent(new CustomEvent("fullscreen-changed",{detail:{fullscreen:!0},bubbles:!0})),this}exitFullscreen(){return this.fullscreen=!1,document.body.classList.remove("no-scroll"),this.dispatchEvent(new CustomEvent("fullscreen-changed",{detail:{fullscreen:!1},bubbles:!0})),this}toggleFullscreen(){return this.fullscreen?this.exitFullscreen():this.enterFullscreen()}resolveMonacoTheme(){return"dark"===this.editorTheme?"vs-dark":"light"===this.editorTheme?"vs":"dark"===s()?"vs-dark":"vs"}static controlSets={full:{topLeft:t`
				<k-control-group>
					<kc-undo></kc-undo>
					<kc-redo></kc-redo>
				</k-control-group>
				<k-control-group>
					<kc-format-code></kc-format-code>
					<kc-copy-code></kc-copy-code>
					<kc-find-replace></kc-find-replace>
				</k-control-group>
				<k-control-group>
					<kc-word-wrap></kc-word-wrap>
					<kc-minimap></kc-minimap>
					<kc-fold-all></kc-fold-all>
				</k-control-group>
				<kc-font-size></kc-font-size>
			`,topRight:t`
				<kc-language></kc-language>
				<kc-editor-theme></kc-editor-theme>
				<kc-fullscreen></kc-fullscreen>
			`,bottomLeft:null,bottomRight:null}};static styles=e`
		:host {
			display: flex;
			flex-direction: column;
			gap: 0;
			height: 400px;
			background: var(--c_bg);
		}
		:host([fullscreen]) {
			position: fixed;
			inset: 0;
			width: auto;
			height: auto;
			z-index: 10000;
		}
		.toolbar-top,
		.toolbar-bottom {
			display: flex;
			align-items: center;
			background: var(--bg-secondary);
			min-height: 40px;
		}
		.toolbar-start {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
		}
		.toolbar-end {
			display: flex;
			flex-wrap: wrap-reverse;
			align-items: center;
			justify-content: flex-end;
			margin-left: auto;
		}
		.editor-container {
			position: relative;
			flex: 1;
			min-height: 0;
			overflow: hidden;
		}
		.monaco-editor-container {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			overflow: auto;
			border: 1px solid var(--border-color);
		}
		[hidden] {
			display: none !important;
		}
		:host([disabled]) {
			opacity: 0.6;
		}
		/* disabled blocks all interaction -- toolbar AND editor. Monaco's
		   readOnly already prevents typing; pointer-events: none also stops
		   focus / cursor placement, matching native form control semantics. */
		:host([disabled]) .toolbar-top,
		:host([disabled]) .toolbar-bottom,
		:host([disabled]) .editor-container {
			pointer-events: none;
		}
		/* readonly keeps the editor interactive (so users can place a cursor
		   to select / copy) but mutes the toolbar so its buttons can't
		   mutate the document. */
		:host([readonly]) .toolbar-top,
		:host([readonly]) .toolbar-bottom {
			pointer-events: none;
			opacity: 0.5;
		}
	`;render(){const e=this.constructor.controlSets[this.controls]??{};return t`
			${this.hasTopToolbar?t`
				<div class="toolbar-top bb">
					<div class="toolbar-start">
						<slot name="toolbar-top-left">${e.topLeft??""}</slot>
					</div>
					<div class="toolbar-end">
						<slot name="toolbar-top-right">${e.topRight??""}</slot>
					</div>
				</div>
			`:""}
			<div class="editor-container">
				<div class="monaco-editor-container"></div>
			</div>
			${this.hasBottomToolbar?t`
				<div class="toolbar-bottom bt">
					<div class="toolbar-start">
						<slot name="toolbar-bottom-left">${e.bottomLeft??""}</slot>
					</div>
					<div class="toolbar-end">
						<slot name="toolbar-bottom-right">${e.bottomRight??""}</slot>
					</div>
				</div>
			`:""}
		`}}customElements.define("k-code-editor",n);