import ShadowComponent from"./ShadowComponent.js";import{html,css}from"../lit-all.min.js";import{boolExists}from"../utils/propConverters.js";export default class Accordion extends ShadowComponent{static properties={multiple:{type:Boolean,reflect:!0,converter:boolExists},persistentId:{type:String,reflect:!0,attribute:"persistent-id"}};constructor(){super(),this.multiple=!1,this.persistentId=null}connectedCallback(){super.connectedCallback?.()}updated(e){if(super.updated?.(e),e.has("persistentId")&&this.persistentId&&window?.localStorage){const e=`accordion-persistent-id-${this.persistentId}`,t=window.localStorage.getItem(e);if(t){const e=t.split(",");this.querySelectorAll("k-accordion-panel").forEach(t=>{t.active=e.includes(t.name);const o=this.getHeader(t.name);o&&(o.active=e.includes(t.name))})}}}getHeader(e){return this.querySelector(`k-accordion-header[for-panel="${e}"]`)}getPanel(e){return this.querySelector(`k-accordion-panel[name="${e}"]`)}openPanel(e){this.multiple||this.querySelectorAll("k-accordion-panel[active]").forEach(t=>{if(t.name!==e){t.active=!1;const e=this.getHeader(t.name);e&&(e.active=!1)}});const t=this.getPanel(e);if(t){t.active=!0,t.transitioning=!0,setTimeout(()=>{t.transitioning=!1},parseInt(getComputedStyle(this).getPropertyValue("--animation_ms")||256));const o=this.getHeader(e);o&&(o.active=!0),this.dispatchEvent(new CustomEvent("openpanel",{detail:{panelName:e}})),setTimeout(()=>{if(this.persistentId&&window?.localStorage){const e=`accordion-persistent-id-${this.persistentId}`,t=Array.from(this.querySelectorAll("k-accordion-panel[active]")).map(e=>e.name);window.localStorage.setItem(e,t.join(","))}},parseInt(getComputedStyle(this).getPropertyValue("--animation_ms")||256))}}closePanel(e){const t=this.getPanel(e);if(t){t.active=!1,t.transitioning=!0,setTimeout(()=>{t.transitioning=!1},parseInt(getComputedStyle(this).getPropertyValue("--animation_ms")||256));const o=this.getHeader(e);o&&(o.active=!1),this.dispatchEvent(new CustomEvent("closepanel",{detail:{panelName:e}})),setTimeout(()=>{if(this.persistentId&&window?.localStorage){const e=`accordion-persistent-id-${this.persistentId}`,t=Array.from(this.querySelectorAll("k-accordion-panel[active]")).map(e=>e.name);window.localStorage.setItem(e,t.join(","))}},parseInt(getComputedStyle(this).getPropertyValue("--animation_ms")||256))}}togglePanel(e){const t=this.getPanel(e);t&&(t.active?this.closePanel(e):this.openPanel(e),this.dispatchEvent(new CustomEvent("togglepanel",{detail:{panelName:e}})))}get activeHeader(){return this.querySelector('k-accordion-header[active="true"]')}get activePanel(){return this.querySelector('k-accordion-panel[active="true"]')}static styles=css`
		:host {
			display: block;
			border: 1px solid var(--c_border, #ccc);
			border-radius: var(--radius);
		}
		::slotted(k-accordion-header) {
			border-top: 1px solid var(--c_border, #ccc);
		}
		::slotted(k-accordion-header) {
			position: relative;
		}
		::slotted(k-accordion-header)::after {
			content: '';
			display: block;
			position: absolute;
			left: var(--spacer_h, 0.5rem);
			right: var(--spacer_h, 0.5rem);
			bottom: 0;
			height: 0;
			width: calc(100% - var(--spacer, 1rem));
			border-bottom: 1px solid var(--c_border, #ccc);
			opacity: 0;
			transition: opacity var(--animation_ms, 256ms);
			pointer-events: none;
		}
		::slotted(k-accordion-header[active])::after {
			opacity: 0.4;
		}
		::slotted(k-accordion-header:first-of-type) {
			border-top: 0;
		}
		::slotted(k-accordion-header:last-of-type:not([active])) {
			border-bottom: 0;
		}
	`;render(){return html`<slot></slot>`}}export class AccordionHeader extends ShadowComponent{static properties={forPanel:{type:String,reflect:!0,attribute:"for-panel"},active:{type:Boolean,reflect:!0,converter:boolExists}};constructor(){super(),this.forPanel="",this.active=!1}handleClick=()=>{this.accordion?.togglePanel(this.forPanel)};connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}get accordion(){return this.closest("k-accordion")}render(){return html`
			<slot name="left-icon">
				<k-icon id="icon" name="chevron"></k-icon>
			</slot>
			<slot></slot>
			<slot name="right-icon"></slot>
		`}static styles=css`
		:host {
			display: block;
			padding: 1rem;
			cursor: pointer;
		}
		#icon {
			will-change: trnasform;
			transition: transform var(--animation_ms, 256ms);
			transform: rotate(0deg);
		}
		:host([active]) #icon {
			transform: rotate(90deg);
		}
	`}export class AccordionPanel extends ShadowComponent{static properties={name:{type:String,reflect:!0},active:{type:Boolean,reflect:!0,converter:boolExists},transitioning:{type:Boolean,reflect:!0,converter:boolExists}};constructor(){super(),this.name="",this.active=!1,this.transitioning=!1}get accordion(){return this.closest("k-accordion")}static styles=css`
		:host {
			display: block;
			interpolate-size: allow-keywords;
			height: 0;
			overflow: hidden;
			transition: height var(--animation_ms, 256ms) ease-in-out;
		}
	:host([active]) {
			height: max-content;
		}
	`;render(){return html`<slot></slot>`}}customElements.define("k-accordion",Accordion),customElements.define("k-accordion-header",AccordionHeader),customElements.define("k-accordion-panel",AccordionPanel);