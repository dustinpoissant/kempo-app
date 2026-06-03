import e from"./ShadowComponent.js";import{html as s,css as t}from"../lit-all.min.js";export default class r extends e{#e=null;connectedCallback(){super.connectedCallback(),this.#s()}disconnectedCallback(){super.disconnectedCallback(),this.#e?.disconnect(),this.#e=null}#s(){this.#e?.disconnect();const e=document.querySelector("k-nav[fixed]");e?(this.#e=new ResizeObserver(e=>{this.style.height=`${e[0].contentRect.height}px`}),this.#e.observe(e)):this.style.height="0px"}render(){return s``}static styles=t`
		:host {
			display: block;
			margin-bottom: var(--spacer);
		}
	`}customElements.define("k-nav-spacer",r);