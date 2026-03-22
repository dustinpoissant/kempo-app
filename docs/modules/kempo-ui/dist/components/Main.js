import ShadowComponent from"./ShadowComponent.js";import{html,css}from"../lit-all.min.js";export default class Main extends ShadowComponent{constructor(){super(),this.widthMap=new Map}connectedCallback(){super.connectedCallback(),window.addEventListener("aside_state_change",this.handleAsideChange),document.querySelectorAll('k-aside[main="push"]').forEach(t=>{if("offscreen"!==t.state){const e=t.getTargetWidth(t.state);e>0&&this.widthMap.set(t,{side:t.side||"left",width:e})}}),this.recalculate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("aside_state_change",this.handleAsideChange)}handleAsideChange=t=>{const{aside:e,state:a,main:i,width:s}=t.detail;"overlay"===i||"offscreen"===a?this.widthMap.delete(e):this.widthMap.set(e,{side:e.side||"left",width:s}),this.recalculate()};recalculate=()=>{let t=0,e=0;for(const[,{side:a,width:i}]of this.widthMap)"right"===a?e=Math.max(e,i):t=Math.max(t,i);this.style.setProperty("--left-panel-width",`${t}px`),this.style.setProperty("--right-panel-width",`${e}px`)};render(){return html`
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
	`}window.customElements.define("k-main",Main);