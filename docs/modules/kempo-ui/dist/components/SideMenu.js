import ShadowComponent from"./ShadowComponent.js";import{html,css}from"../lit-all.min.js";import{boolTrueFalse}from"../utils/propConverters.js";import"./FocusCapture.js";import"./Icon.js";export default class SideMenu extends ShadowComponent{static properties={opened:{type:Boolean,reflect:!0},overlayClose:{type:Boolean,reflect:!0,attribute:"overlay-close",converter:boolTrueFalse},escClose:{type:Boolean,reflect:!0,attribute:"esc-close",converter:boolTrueFalse},side:{type:String,reflect:!0}};constructor(){super(),this.opened=!1,this.overlayClose=!0,this.escClose=!0,this.side="left"}overlayClick=()=>{this.overlayClose&&this.close()};handleKeyDown=e=>{this.escClose&&"Escape"===e.key&&this.close()};updated(e){super.updated(e),e.has("opened")&&(this.opened?(document.body.classList.add("no-scroll"),document.addEventListener("keydown",this.handleKeyDown),this.dispatchEvent(new CustomEvent("change",{detail:"open"})),this.dispatchEvent(new CustomEvent("open"))):(document.body.classList.remove("no-scroll"),document.removeEventListener("keydown",this.handleKeyDown),this.dispatchEvent(new CustomEvent("change",{detail:"close"})),this.dispatchEvent(new CustomEvent("close"))))}open(){this.opened=!0}close(){this.opened=!1}toggle(){this.opened?this.close():this.open(),this.dispatchEvent(new CustomEvent("toggle"))}render(){return html`
			<k-focus-capture>
				<div id="container">
					<button id="overlay" @click=${this.overlayClick}>
						<div id="overlay-x"><k-icon name="close"></k-icon></div>
					</button>
					<div id="menu">
						<slot></slot>
					</div>
				</div>
			</k-focus-capture>
		`}static styles=css`
		:host {
			--bg: var(--c_bg);
			--width: 20rem;

			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			max-width: 100%;
			height: 100vh;
			z-index: 100;
			pointer-events: none;
		}
		:host([opened]) {
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
			opacity: 0;
			transition: opacity var(--animation_ms, 256ms);
		}
		:host([opened]) #container {
			opacity: 1;
		}
		#overlay {
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
		:host([overlay-close="false"]) #overlay {
			cursor: default;
		}
		#menu {
			position: absolute;
			width: var(--width);
			max-width: calc(100vw - 6rem);
			height: 100vh;
			overflow-y: auto;
			left: calc(var(--width) * -1);
			top: 0;
			background: var(--bg);
			transition: left var(--animation_ms, 256ms);
			padding: var(--menu_padding, var(--spacer));
			z-index: 2;
		}
		:host([opened]) #menu {
			left: 0;
		}
		:host([side="right"]) #menu {
			left: auto;
			transition: right var(--animation_ms, 256ms);
			right: calc(var(--width) * -1);
		}
		:host([opened][side="right"]) #menu {
			right: 0;
		}
		:host([side="right"]) #overlay-x {
			right: auto;
			left: var(--spacer_h);
		}
	`}window.customElements.define("k-side-menu",SideMenu);