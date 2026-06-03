import{html as t,css as e}from"../lit-all.min.js";import s from"./ShadowComponent.js";import{boolExists as o}from"../utils/propConverters.js";export class Tabs extends s{static properties={active:{type:String,reflect:!0},fixedHeight:{type:Boolean,reflect:!0,attribute:"fixed-height",converter:o},persistentId:{type:String,reflect:!0,attribute:"persistent-id"}};constructor(){super(),this.active="",this.fixedHeight=!1,this.persistentId=null}firstUpdated(){if(super.firstUpdated(),!this.active){const t=this.querySelector("k-tab-content");t&&(this.active=t.name)}this.setupScrollListeners(),this.updateScrollIndicators(),new ResizeObserver(()=>this.updateScrollIndicators()).observe(this.shadowRoot.getElementById("tabs"))}updated(t){if(super.updated(t),t.has("persistentId")&&this.persistentId&&window?.localStorage){const t=`tabs-persistent-id-${this.persistentId}`,e=window.localStorage.getItem(t);null!==e&&(this.active=e,this.dispatchEvent(new CustomEvent("restored",{detail:{tab:e},bubbles:!0})))}t.has("active")&&this.updateActiveElements()}setupScrollListeners(){const t=this.shadowRoot.getElementById("tabs"),e=this.shadowRoot.getElementById("scroll-left"),s=this.shadowRoot.getElementById("scroll-right");t.addEventListener("scroll",()=>this.updateScrollIndicators()),e.addEventListener("click",()=>{t.scrollBy({left:-200,behavior:"smooth"})}),s.addEventListener("click",()=>{t.scrollBy({left:200,behavior:"smooth"})})}updateScrollIndicators(){const t=this.shadowRoot.getElementById("tabs"),e=this.shadowRoot.getElementById("scroll-left"),s=this.shadowRoot.getElementById("scroll-right"),o=t.scrollLeft>0,i=t.scrollLeft<t.scrollWidth-t.clientWidth;e.classList.toggle("visible",o),s.classList.toggle("visible",i)}updateActiveElements(){const t=this.getActiveTab();t&&(t.active=!1);const e=this.getActiveContent();e&&(e.active=!1);const s=this.getTab(this.active);s&&(s.active=!0);const o=this.getContent(this.active);if(o&&(o.active=!0),this.dispatchEvent(new CustomEvent("tab",{detail:{tab:this.active},bubbles:!0})),this.persistentId&&window?.localStorage){const t=`tabs-persistent-id-${this.persistentId}`;window.localStorage.setItem(t,this.active)}}get contents(){return[...this.querySelectorAll(":scope > k-tab-content")]}get tabs(){return[...this.querySelectorAll(":scope > k-tab")]}getTab(t){let e;if("string"==typeof t&&(e=this.querySelector(`k-tab[for="${t}"]`)),!e){let s=parseInt(t);s||(s=0),e=this.querySelectorAll("k-tab")[s]}return e}getActiveTab(){return this.querySelector(":scope > k-tab[active]")}getContent(t){let e;if("string"==typeof t&&(e=this.querySelector(`k-tab-content[name="${t}"]`)),!e){let s=parseInt(t);s||(s=0),e=this.querySelectorAll("k-tab-content")[s]}return e}getActiveContent(){return this.querySelector(":scope > k-tab-content[active]")}static styles=e`
		:host {
			display: block;
			width: 100%;
		}

		#wrapper {
			display: flex;
			flex-direction: column;
			width: 100%;
			min-width: 0;
		}

		#tabs-container {
			position: relative;
			border-bottom: 1px solid var(--c_border);
		}

		#tabs {
			display: flex;
			overflow-x: auto;
			overflow-y: hidden;
		}

		#tabs ::slotted(*) {
			flex: 0 0 auto;
		}

		.scroll-indicator {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 72px;
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.2s;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding-bottom: 2px;
		}

		.scroll-indicator .arrow {
			color: var(--tc_base);
			z-index: 1;
		}

		.scroll-indicator.visible {
			opacity: 1;
		}

		#scroll-left {
			left: 0;
			background: linear-gradient(90deg, 
				var(--c_bg) 0%,
				var(--c_bg) 30%,
				transparent 100%
			);
		}

		#scroll-right {
			right: 0;
			justify-content: flex-end;
			background: linear-gradient(-90deg, 
				var(--c_bg) 0%,
				var(--c_bg) 30%,
				transparent 100%
			);
		}

		:host([fixed-height]) #wrapper {
			height: 100%;
		}

		:host([fixed-height]) #contents {
			height: 100%;
			flex: 1;
			min-height: 1.35rem;
			overflow: auto;
		}
	`;render(){return t`
			<div id="wrapper">
				<div id="tabs-container">
					<div id="scroll-left" class="scroll-indicator">
						<svg class="arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</div>
					<div id="tabs">
						<slot name="tabs"></slot>
					</div>
					<div id="scroll-right" class="scroll-indicator">
						<svg class="arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M8 15L13 10L8 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</div>
				</div>
				<div id="contents">
					<slot></slot>
				</div>
			</div>
		`}}export class Tab extends s{static properties={active:{type:Boolean,reflect:!0,converter:o},for:{type:String,reflect:!0}};constructor(){super(),this.active=!1,this.for="",this.slot="tabs"}handleClick=()=>{if(!this.active){const t=this.parentElement;t&&"K-TABS"===t.tagName&&(t.active=this.for||t.tabs.indexOf(this).toString())}};get tabs(){return"K-TABS"===this.parentElement?.tagName?this.parentElement:null}render(){return t`
			<button id="button" @click=${this.handleClick}>
				<slot></slot>
			</button>
		`}static styles=e`
		:host {
			margin-bottom: -1px;
			flex: 0 0 auto;
		}

		#button {
			padding: var(--spacer_h);
			background-color: transparent;
			border: none;
			cursor: inherit;
			box-shadow: none;
			color: inherit;
			white-space: nowrap;
		}

		:host(:not([active])) #button {
			cursor: pointer;
		}

		:host([active]) {
			border-bottom: 3px solid var(--c_primary);
			margin-bottom: -1px;
		}

		:host([active]) #button {
			color: var(--tc_primary);
		}
	`}export class TabContent extends s{static properties={active:{type:Boolean,reflect:!0,converter:o},name:{type:String,reflect:!0}};constructor(){super(),this.active=!1,this.name=""}get tabs(){return"K-TABS"===this.parentElement?.tagName?this.parentElement:null}render(){return t`<slot></slot>`}static styles=e`
		:host {
			display: block;
			height: 100%;
			max-height: 100%;
			flex: 1 1 auto;
			overflow: auto;
			padding-top: var(--spacer, 1rem);
		}

		:host([active]) {
			display: block;
		}

		:host(:not([active])) {
			display: none;
		}
	`}export class TabSpacer extends s{constructor(){super(),this.slot="tabs"}static styles=e`
		:host {
			flex: 1 1 auto !important;
			height: 1px;
		}
	`;render(){return t`<slot></slot>`}}customElements.define("k-tabs",Tabs),customElements.define("k-tab",Tab),customElements.define("k-tab-content",TabContent),customElements.define("k-tab-spacer",TabSpacer);export default{Tab:Tab,TabContent:TabContent,Tabs:Tabs,TabSpacer:TabSpacer};