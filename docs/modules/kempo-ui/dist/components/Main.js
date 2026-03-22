import ShadowComponent from"./ShadowComponent.js";import{html,css}from"../lit-all.min.js";export default class Main extends ShadowComponent{static properties={leftPanelWidth:{type:String,state:!0},rightPanelWidth:{type:String,state:!0}};constructor(){super(),this.leftPanelWidth="0px",this.rightPanelWidth="0px",this.handlePanelChange=this.handlePanelChange.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("side-panel-change",this.handlePanelChange);const t=document.querySelector('k-side-panel:not([side="right"])');t&&(this.leftPanelWidth=t.collapsed?"3.5rem":"16rem");const e=document.querySelector('k-side-panel[side="right"]');e&&(this.rightPanelWidth=e.collapsed?"3.5rem":"16rem")}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("side-panel-change",this.handlePanelChange)}handlePanelChange(t){"right"===t.detail.side?this.rightPanelWidth=t.detail.width:this.leftPanelWidth=t.detail.width}render(){return html`
			<main>
				<slot></slot>
			</main>
		`}static styles=css`
		:host {
			display: block;
			margin-left: var(--left-panel-width, 0px);
			margin-right: var(--right-panel-width, 0px);
			transition: margin-left var(--animation_ms, 256ms), margin-right var(--animation_ms, 256ms);
		}
		main {
			max-width: var(--container_width, 90rem);
			margin-left: auto;
			margin-right: auto;
			padding-top: var(--spacer);
			padding-left: var(--spacer);
			padding-right: var(--spacer);
		}
	`;updated(){super.updated(),this.style.setProperty("--left-panel-width",this.leftPanelWidth),this.style.setProperty("--right-panel-width",this.rightPanelWidth)}}window.customElements.define("k-main",Main);