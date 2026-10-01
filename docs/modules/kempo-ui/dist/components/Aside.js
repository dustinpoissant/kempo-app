import e from"./ShadowComponent.js";import{html as t,css as s,nothing as a}from"../lit-all.min.js";import{boolTrueFalse as i}from"../utils/propConverters.js";import"./Dropdown.js";import"./FocusCapture.js";import"./Icon.js";export default class o extends e{static properties={state:{type:String,reflect:!0},side:{type:String,reflect:!0},main:{type:String,reflect:!0},overlayClose:{type:Boolean,reflect:!0,attribute:"overlay-close",converter:i},escClose:{type:Boolean,reflect:!0,attribute:"esc-close",converter:i},persistentId:{type:String,reflect:!0,attribute:"persistent-id"}};constructor(){super(),this.state="offscreen",this.side="left",this.main="overlay",this.overlayClose=!0,this.escClose=!0,this.persistentId=null}overlayClick=()=>{this.overlayClose&&this.hide()};handleKeyDown=e=>{this.escClose&&"Escape"===e.key&&("overlay"===this.main?this.hide():this.collapse())};updated(e){if(super.updated(e),e.has("persistentId")&&this.persistentId&&window?.localStorage){const e=`aside-persistent-id-${this.persistentId}`,t=window.localStorage.getItem(e);"offscreen"===t?window.localStorage.removeItem(e):t&&(this.state=t)}if(e.has("state")){const t=e.get("state");"offscreen"===this.state||"offscreen"!==t&&void 0!==t?"offscreen"===this.state&&void 0!==t&&"offscreen"!==t&&document.removeEventListener("keydown",this.handleKeyDown):document.addEventListener("keydown",this.handleKeyDown),"overlay"===this.main&&("expanded"===this.state?document.body.classList.add("no-scroll"):document.body.classList.remove("no-scroll"));const s="offscreen"===this.state?0:this.getTargetWidth(this.state),a={aside:this,state:this.state,main:this.main,width:s};if(this.dispatchEvent(new CustomEvent("aside_state_change",{detail:a})),window.dispatchEvent(new CustomEvent("aside_state_change",{detail:a})),this.inert="offscreen"===this.state,this.persistentId&&window?.localStorage){const e=`aside-persistent-id-${this.persistentId}`;"offscreen"===this.state?window.localStorage.removeItem(e):window.localStorage.setItem(e,this.state)}}}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.handleKeyDown),document.body.classList.remove("no-scroll");const e={aside:this,state:"offscreen",main:this.main,width:0};this.dispatchEvent(new CustomEvent("aside_state_change",{detail:e})),window.dispatchEvent(new CustomEvent("aside_state_change",{detail:e}))}expand=()=>this.state="expanded";collapse=()=>this.state="collapsed";hide=()=>this.state="offscreen";toggle=()=>{"expanded"===this.state?this.state="overlay"===this.main?"offscreen":"collapsed":this.state="expanded"};getTargetWidth(e){const t=parseFloat(getComputedStyle(document.documentElement).fontSize),s="collapsed"===e?"--collapsed-width":"--width",a=getComputedStyle(this).getPropertyValue(s).trim();return(a?parseFloat(a):"collapsed"===e?3.5:20)*t}render(){const e=t`<aside><slot></slot></aside>`;return"overlay"===this.main?t`
				<k-focus-capture>
					<div id="container">
						<button id="overlay-btn" @click=${this.overlayClick}>
							<div id="overlay-x"><k-icon name="close"></k-icon></div>
						</button>
						${e}
					</div>
				</k-focus-capture>
			`:e}static styles=s`
		:host {
			--bg: var(--c_bg);
			--border: var(--c_border);
			--width: 20rem;
			--collapsed-width: 3.5rem;
			position: fixed;
			top: 0;
			height: 100vh;
			pointer-events: none;
		}
		:host([main="push"]) {
			left: 0;
			z-index: 30;
			transition: width var(--animation_ms, 256ms);
		}
		:host([main="push"][side="right"]) {
			left: auto;
			right: 0;
		}
		:host([main="push"][state="collapsed"]) {
			width: var(--collapsed-width);
			pointer-events: auto;
		}
		:host([main="push"][state="expanded"]) {
			width: var(--width);
			pointer-events: auto;
		}
		:host([main="overlay"]) {
			left: 0;
			width: 100vw;
			max-width: 100%;
			z-index: 60;
			overflow: hidden;
		}
		:host([main="overlay"][state="expanded"]) {
			pointer-events: auto;
		}
		k-focus-capture {
			width: 100%;
			height: 100%;
		}
		#container {
			position: relative;
			width: 100%;
			height: 100%;
		}
		#overlay-btn {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			background: var(--overlay, rgba(0, 0, 0, 0.5));
			border: none;
			padding: 0;
			cursor: pointer;
			z-index: 1;
			opacity: 0;
			transition: opacity var(--animation_ms, 256ms);
		}
		:host([state="expanded"]) #overlay-btn {
			opacity: 1;
		}
		#overlay-x {
			position: absolute;
			top: var(--spacer_h);
			right: var(--spacer_h);
			font-size: 1.75rem;
			cursor: pointer;
			color: var(--tc_light);
		}
		:host([overlay-close="false"]) #overlay-x {
			display: none;
		}
		:host([overlay-close="false"]) #overlay-btn {
			cursor: default;
		}
		:host([side="right"]) #overlay-x {
			right: auto;
			left: var(--spacer_h);
		}
		aside {
			display: flex;
			flex-direction: column;
			position: fixed;
			top: 0;
			left: 0;
			height: 100vh;
			overflow-y: auto;
			overflow-x: hidden;
			background: var(--bg);
			padding: var(--aside_padding, var(--spacer));
			z-index: 2;
			box-sizing: border-box;
			border-right: 1px solid var(--border);
			transition: width var(--animation_ms, 256ms), transform var(--animation_ms, 256ms);
		}
		:host([side="right"]) aside {
			left: auto;
			right: 0;
			border-right: none;
			border-left: 1px solid var(--border);
		}
		:host([main="push"]) aside {
			position: absolute;
			width: var(--width);
			transform: translateX(-100%);
		}
		:host([main="push"][side="right"]) aside {
			transform: translateX(100%);
		}
		:host([main="push"][state="collapsed"]) aside {
			width: var(--collapsed-width);
			transform: none;
		}
		:host([main="push"][state="expanded"]) aside {
			transform: none;
		}
		:host([main="overlay"]) aside {
			width: var(--width);
			max-width: calc(100vw - 6rem);
			border: none;
			transform: translateX(-100%);
		}
		:host([main="overlay"][state="expanded"]) aside {
			transform: none;
		}
		:host([main="overlay"][side="right"]) aside {
			transform: translateX(100%);
		}
		:host([main="overlay"][side="right"][state="expanded"]) aside {
			transform: none;
		}
	`}customElements.define("k-aside",o);class n extends e{static properties={icon:{type:String},href:{type:String},active:{type:Boolean,reflect:!0},collapsed:{type:Boolean,reflect:!0},"no-expand":{type:Boolean,attribute:"no-expand"},"hide-when-collapsed":{type:Boolean,attribute:"hide-when-collapsed"}};constructor(){super(),this.icon="",this.href="#",this.active=!1,this.collapsed=!1,this["no-expand"]=!1,this["hide-when-collapsed"]=!1}connectedCallback(){super.connectedCallback(),this.aside=this.closest("k-aside"),this.inMenu=!!this.closest("k-aside-menu"),this.aside&&!this.inMenu&&(this.collapsed="collapsed"===this.aside.state,this.aside.addEventListener("aside_state_change",this.handleStateChange))}disconnectedCallback(){super.disconnectedCallback(),this.aside&&this.aside.removeEventListener("aside_state_change",this.handleStateChange)}handleStateChange=e=>{const{state:t}=e.detail;"collapsed"===t?this.collapsed=!0:"expanded"===t&&(this.collapsed=!1)};handleClick=e=>{this.collapsed&&!this["no-expand"]&&this.aside&&(e.preventDefault(),this.aside.expand())};render(){return t`
			<a href="${this.href}" class="item ${this.active?"active bg-primary":""}" @click=${this.handleClick}>
				${this.icon?t`<k-icon name="${this.icon}"></k-icon>`:this.collapsed?t`<k-icon name="dot"></k-icon>`:a}
				${this.collapsed?a:t`<span class="label"><slot></slot></span>`}
			</a>
		`}static styles=s`
		:host {
			display: block;
		}
		:host([collapsed][hide-when-collapsed]) {
			display: none;
		}
		.item {
			display: flex;
			align-items: center;
			gap: var(--spacer_h);
			padding: var(--spacer_h);
			color: var(--tc);
			text-decoration: none;
			border-radius: var(--radius);
			margin: 0 var(--spacer_h);
			transition: background var(--animation_ms), color var(--animation_ms);
			white-space: nowrap;
		}
		.item:hover {
			background: var(--c_bg_hover);
		}
		.item.active {
			color: var(--tc_on_primary);
		}
		.item.active:hover {
			background: var(--c_primary);
			filter: brightness(1.1);
		}
		k-icon {
			flex-shrink: 0;
		}
		.label {
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	`}class r extends e{static properties={collapsed:{type:Boolean,reflect:!0}};constructor(){super(),this.collapsed=!1}connectedCallback(){super.connectedCallback(),this.aside=this.closest("k-aside"),this.aside&&(this.collapsed="collapsed"===this.aside.state,this.aside.addEventListener("aside_state_change",this.handleStateChange))}disconnectedCallback(){super.disconnectedCallback(),this.aside&&this.aside.removeEventListener("aside_state_change",this.handleStateChange)}handleStateChange=e=>{const{state:t}=e.detail;"collapsed"===t?this.collapsed=!0:"expanded"===t&&(this.collapsed=!1)};render(){return this.collapsed?t`<hr>`:t`<div class="label"><slot></slot></div>`}static styles=s`
		:host {
			display: block;
			margin: var(--spacer_h) 0;
		}
		:host([collapsed]) {
			margin: 0 var(--spacer_h);
			align-self: stretch;
		}
		.label {
			padding: 0 var(--spacer);
			font-size: 0.75rem;
			font-weight: 600;
			text-transform: uppercase;
			color: var(--c_text_muted);
			letter-spacing: 0.05em;
		}
		hr {
			border: none;
			border-top: 1px solid var(--c_border);
			margin: var(--spacer_h) var(--spacer);
		}
		:host([collapsed]) hr {
			margin: var(--spacer_h) 0;
		}
	`}class d extends e{static properties={icon:{type:String},label:{type:String},open:{type:Boolean,reflect:!0},collapsed:{type:Boolean,reflect:!0},side:{type:String},"no-expand":{type:Boolean,attribute:"no-expand"},"hide-when-collapsed":{type:Boolean,attribute:"hide-when-collapsed"}};constructor(){super(),this.icon="",this.label="",this.open=!1,this.collapsed=!1,this.side="left",this["no-expand"]=!1,this["hide-when-collapsed"]=!1}connectedCallback(){super.connectedCallback(),this.aside=this.closest("k-aside"),this.aside&&(this.collapsed="collapsed"===this.aside.state,this.side=this.aside.side||"left",this.aside.addEventListener("aside_state_change",this.handleStateChange))}disconnectedCallback(){super.disconnectedCallback(),this.aside&&this.aside.removeEventListener("aside_state_change",this.handleStateChange)}handleStateChange=e=>{const{state:t}=e.detail;"collapsed"===t?(this.collapsed=!0,this.open=!1):"expanded"===t&&(this.collapsed=!1),this.side=this.aside?.side||"left"};toggleMenu=()=>{this.collapsed||(this.open=!this.open)};handleCollapsedClick=()=>{this.open=!0,this.aside?.expand()};render(){if(this.collapsed){const e="right"===this.side?"left down":"right down";return t`
				<k-dropdown open-direction=${e} hover>
					<button slot="trigger" class="no-btn collapsed-trigger" @click=${this.handleCollapsedClick}>
						${this.icon?t`<k-icon name="${this.icon}"></k-icon>`:t`<k-icon name="dot"></k-icon>`}
					</button>
					<slot></slot>
				</k-dropdown>
			`}return t`
			<div class="menu-container">
				<button class="no-btn menu-header ${this.open?"open":""}" @click=${this.toggleMenu}>
					${this.icon?t`<k-icon name="${this.icon}"></k-icon>`:a}
					<span class="label">${this.label}</span>
					<k-icon class="chevron" name="chevron" direction="${this.open?"down":"right"}"></k-icon>
				</button>
				<div class="menu-content ${this.open?"open":""}">
					<slot></slot>
				</div>
			</div>
		`}static styles=s`
		:host {
			display: block;
		}
		:host([collapsed][hide-when-collapsed]) {
			display: none;
		}
		.menu-header {
			display: flex !important;
			align-items: center;
			gap: var(--spacer_h);
			padding: var(--spacer_h) !important;
			color: var(--tc);
			background: transparent;
			border: none;
			border-radius: var(--radius);
			margin: 0 var(--spacer_h);
			width: calc(100% - var(--spacer));
			cursor: pointer;
			text-align: left;
			white-space: nowrap;
			transition: background var(--animation_ms);
		}
		.menu-header:hover {
			background: var(--c_bg_hover);
		}
		.collapsed-trigger {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: var(--spacer_h);
			color: var(--tc);
			background: transparent;
			border: none;
			appearance: none;
			border-radius: var(--radius);
			margin: 0 var(--spacer_h);
			cursor: pointer;
			transition: background var(--animation_ms);
		}
		.collapsed-trigger:hover {
			background: var(--c_bg_hover);
		}
		k-dropdown {
			display: block;
		}
		k-icon {
			flex-shrink: 0;
		}
		.label {
			flex: 1;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.chevron {
			transition: transform var(--animation_ms);
		}
		.menu-content {
			max-height: 0;
			overflow: hidden;
			transition: max-height var(--animation_ms);
			padding-left: calc(var(--spacer_h) * 2);
		}
		.menu-content.open {
			max-height: 500px;
		}
		::slotted(*) {
			margin: 0.25rem 0;
		}
	`}class l extends e{render(){return t`<div></div>`}static styles=s`
		:host {
			display: block;
			flex: 1;
		}
	`}class c extends e{static properties={collapsed:{type:Boolean,reflect:!0},direction:{type:String}};constructor(){super(),this.collapsed=!1,this.direction="left"}connectedCallback(){super.connectedCallback(),this.aside=this.closest("k-aside"),this.aside&&(this.collapsed="collapsed"===this.aside.state,this.updateDirection(),this.aside.addEventListener("aside_state_change",this.handleStateChange))}disconnectedCallback(){super.disconnectedCallback(),this.aside&&this.aside.removeEventListener("aside_state_change",this.handleStateChange)}handleStateChange=e=>{const{state:t}=e.detail;"collapsed"===t?this.collapsed=!0:"expanded"===t&&(this.collapsed=!1),this.updateDirection()};handleClick=()=>{this.aside&&(this.aside.state="collapsed"===this.aside.state?"expanded":"collapsed")};updateDirection=()=>{const e="right"===this.aside?.side;this.direction=this.collapsed!==e?"right":"left"};render(){return t`
			<div id="header">
				<slot></slot>
				<button id="toggle" @click=${this.handleClick}>
					<k-icon name="arrow-line" direction=${this.direction}></k-icon>
				</button>
			</div>
		`}static styles=s`
		:host {
			display: block;
		}
		#header {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: var(--spacer_h);
			padding: var(--spacer_h);
			border-bottom: 1px solid var(--c_border);
			flex-shrink: 0;
		}
		::slotted(*) {
			margin-right: auto;
			flex: 1;
			min-width: 0;
		}
		:host([collapsed]) ::slotted(*) {
			display: none;
		}
		#toggle {
			flex-shrink: 0;
			width: 2rem;
			height: 2rem;
			border: none;
			appearance: none;
			background: transparent;
			color: var(--c_text);
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: var(--radius);
			padding: 0;
		}
		#toggle:hover {
			background: var(--c_bg_hover);
		}
	`}customElements.define("k-aside-item",n),customElements.define("k-aside-label",r),customElements.define("k-aside-menu",d),customElements.define("k-aside-spacer",l),customElements.define("k-aside-toggle",c);