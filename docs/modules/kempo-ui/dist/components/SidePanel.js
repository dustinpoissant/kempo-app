import ShadowComponent from"./ShadowComponent.js";import{html,css,nothing}from"../lit-all.min.js";import"./Icon.js";class SidePanel extends ShadowComponent{static properties={collapsed:{type:Boolean,reflect:!0},side:{type:String,reflect:!0},persistentId:{type:String,reflect:!0,attribute:"persistent-id"}};constructor(){super(),this.collapsed=!1,this.side="left",this.persistentId=null,this.isInitialLoad=!0}toggleClick=()=>this.toggle();updated(e){if(super.updated(e),e.has("persistentId")&&this.persistentId&&window?.localStorage){const e=`side-panel-persistent-id-${this.persistentId}`,t=window.localStorage.getItem(e);null!==t&&(this.collapsed="true"===t,this.isInitialLoad=!1)}if(e.has("collapsed")){if(this.persistentId&&window?.localStorage&&!this.isInitialLoad){const e=`side-panel-persistent-id-${this.persistentId}`;window.localStorage.setItem(e,this.collapsed.toString())}this.isInitialLoad=!1;const e=this.collapsed?"collapse":"expand";this.dispatchEvent(new CustomEvent(e)),this.dispatchEvent(new CustomEvent("change",{detail:e})),window.dispatchEvent(new CustomEvent("side-panel-change",{detail:{collapsed:this.collapsed,width:this.collapsed?"3.5rem":"16rem",side:this.side}}))}}expand=()=>this.collapsed=!1;collapse=()=>this.collapsed=!0;toggle(){this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent("toggle"))}render(){return html`
			<div id="header">
				<slot name="logo"></slot>
				<button id="toggle" @click=${this.toggleClick} aria-label="${this.collapsed?"Expand panel":"Collapse panel"}">
					<k-icon name="arrow-line" direction="${(()=>"right"===this.side?this.collapsed?"left":"right":this.collapsed?"right":"left")()}"></k-icon>
				</button>
			</div>
			<div id="content">
				<slot></slot>
			</div>
		`}static styles=css`
		:host {
			--bg: var(--c_bg);
			--width-expanded: 16rem;
			--transition-duration: var(--animation_ms, 256ms);
			display: flex;
			flex-direction: column;
			position: fixed;
			top: 0;
			left: 0;
			height: 100vh;
			width: var(--width-expanded);
			transition: width var(--transition-duration);
			background: var(--bg);
			border-right: 1px solid var(--c_border);
			z-index: 99;
		}
		:host([collapsed]) {
			width: auto;
		}
		:host([side="right"]) {
			left: auto;
			right: 0;
			border-right: none;
			border-left: 1px solid var(--c_border);
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
		::slotted([slot="logo"]) {
			margin-right: auto;
			flex: 1;
			min-width: 0;
			opacity: 1;
			transition: opacity var(--transition-duration);
		}
		:host([collapsed]) ::slotted([slot="logo"]) {
			display: none;
		}
		#toggle {
			flex-shrink: 0;
			width: 2rem;
			height: 2rem;
			border: none;
			background: transparent;
			color: var(--c_text);
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: var(--radius);
		}
		#toggle:hover {
			background: var(--c_bg_hover);
		}
		#content {
			flex: 1;
			min-height: 0;
			overflow-y: auto;
			overflow-x: hidden;
			display: flex;
			flex-direction: column;
		}
		:host([collapsed]) #content {
			align-items: flex-start;
		}
		:host(:not([collapsed])) #content {
			/* scrollbar-gutter: stable; */
		}
	`}class SidePanelItem extends ShadowComponent{static properties={icon:{type:String},href:{type:String},active:{type:Boolean,reflect:!0},collapsed:{type:Boolean,reflect:!0},"no-expand":{type:Boolean,attribute:"no-expand"},"hide-when-collapsed":{type:Boolean,attribute:"hide-when-collapsed"}};constructor(){super(),this.icon="",this.href="#",this.active=!1,this.collapsed=!1,this["no-expand"]=!1,this["hide-when-collapsed"]=!1}connectedCallback(){super.connectedCallback(),this.panel=this.closest("k-side-panel"),this.panel&&(this.collapsed=this.panel.collapsed,this.panel.addEventListener("collapse",this.handleCollapse),this.panel.addEventListener("expand",this.handleExpand))}disconnectedCallback(){super.disconnectedCallback(),this.panel&&(this.panel.removeEventListener("collapse",this.handleCollapse),this.panel.removeEventListener("expand",this.handleExpand))}handleCollapse=()=>{this.collapsed=!0,this.requestUpdate()};handleExpand=()=>{this.collapsed=!1,this.requestUpdate()};handleClick=e=>{this.collapsed&&!this["no-expand"]&&this.panel&&(e.preventDefault(),this.panel.expand())};render(){return html`
			<a href="${this.href}" class="item ${this.active?"active bg-primary":""}" @click=${this.handleClick}>
				${this.icon?html`<k-icon name="${this.icon}"></k-icon>`:this.collapsed?html`<k-icon name="dot"></k-icon>`:nothing}
				${this.collapsed?nothing:html`<span class="label"><slot></slot></span>`}
			</a>
		`}static styles=css`
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
			color: var(--c_text);
			text-decoration: none;
			border-radius: var(--radius);
			margin: 0 var(--spacer_h);
			transition: background var(--animation_ms), color var(--animation_ms);
			white-space: nowrap;
		}
		:host([collapsed]) .item {
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
	`}class SidePanelLabel extends ShadowComponent{static properties={collapsed:{type:Boolean,reflect:!0}};constructor(){super(),this.collapsed=!1}connectedCallback(){super.connectedCallback(),this.panel=this.closest("k-side-panel"),this.panel&&(this.collapsed=this.panel.collapsed,this.panel.addEventListener("collapse",this.handleCollapse),this.panel.addEventListener("expand",this.handleExpand))}disconnectedCallback(){super.disconnectedCallback(),this.panel&&(this.panel.removeEventListener("collapse",this.handleCollapse),this.panel.removeEventListener("expand",this.handleExpand))}handleCollapse=()=>{this.collapsed=!0,this.requestUpdate()};handleExpand=()=>{this.collapsed=!1,this.requestUpdate()};render(){return this.collapsed?html`<hr>`:html`<div class="label"><slot></slot></div>`}static styles=css`
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
	`}class SidePanelMenu extends ShadowComponent{static properties={icon:{type:String},label:{type:String},open:{type:Boolean,reflect:!0},collapsed:{type:Boolean,reflect:!0},"no-expand":{type:Boolean,attribute:"no-expand"},"hide-when-collapsed":{type:Boolean,attribute:"hide-when-collapsed"}};constructor(){super(),this.icon="",this.label="",this.open=!1,this.collapsed=!1,this["no-expand"]=!1,this["hide-when-collapsed"]=!1}connectedCallback(){super.connectedCallback(),this.panel=this.closest("k-side-panel"),this.panel&&(this.collapsed=this.panel.collapsed,this.panel.addEventListener("collapse",this.handleCollapse),this.panel.addEventListener("expand",this.handleExpand))}disconnectedCallback(){super.disconnectedCallback(),this.panel&&(this.panel.removeEventListener("collapse",this.handleCollapse),this.panel.removeEventListener("expand",this.handleExpand))}handleCollapse=()=>{this.collapsed=!0,this.open=!1,this.requestUpdate()};handleExpand=()=>{this.collapsed=!1,this.requestUpdate()};toggleMenu=()=>{this.collapsed&&!this["no-expand"]&&this.panel?this.panel.expand():this.collapsed||(this.open=!this.open)};render(){return html`
			<div class="menu-container">
				<button class="no-btn menu-header ${this.open?"open":""}" @click=${this.toggleMenu}>
					${this.icon?html`<k-icon name="${this.icon}"></k-icon>`:this.collapsed?html`<k-icon name="dot"></k-icon>`:nothing}
					${this.collapsed?nothing:html`<span class="label">${this.label}</span>`}
					${this.collapsed?nothing:html`<k-icon class="chevron" name="chevron" direction="${this.open?"down":"right"}"></k-icon>`}
				</button>
				<div class="menu-content ${this.open&&!this.collapsed?"open":""}">
					<slot></slot>
				</div>
			</div>
		`}static styles=css`
		:host {
			display: block;
		}
		:host([collapsed][hide-when-collapsed]) {
			display: none;
		}
		.menu-container {
			margin: 0;
		}
		.menu-header {
			display: flex !important;
			align-items: center;
			gap: var(--spacer_h);
			padding-top: var(--spacer_h) !important;
			padding-bottom: var(--spacer_h) !important;
			padding-left: var(--spacer_h) !important;
			padding-right: var(--spacer_h) !important;
			color: var(--c_text);
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
		:host([collapsed]) .menu-header {
			width: auto;
		}
		.menu-header:hover {
			background: var(--c_bg_hover);
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
		:host([collapsed]) .menu-content {
			padding-left: 0;
		}
		.menu-content.open {
			max-height: 500px;
		}
		::slotted(*) {
			margin: 0.25rem 0;
		}
	`}class SidePanelSpacer extends ShadowComponent{render(){return html`<div class="spacer"></div>`}static styles=css`
		:host {
			display: block;
			flex: 1;
		}
		.spacer {
			height: 100%;
		}
	`}customElements.define("k-side-panel",SidePanel),customElements.define("k-side-panel-item",SidePanelItem),customElements.define("k-side-panel-label",SidePanelLabel),customElements.define("k-side-panel-menu",SidePanelMenu),customElements.define("k-side-panel-spacer",SidePanelSpacer);export default SidePanel;