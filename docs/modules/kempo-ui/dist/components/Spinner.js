import{html as r,css as n}from"../lit-all.min.js";import s from"./ShadowComponent.js";export default class e extends s{static properties={size:{type:String,reflect:!0},variant:{type:String,reflect:!0}};constructor(){super(),this.size="md",this.variant="spinner"}render(){switch(this.variant){case"dots":return r`<div class="dots"><span></span><span></span><span></span></div>`;case"bars":return r`<div class="bars"><span></span><span></span><span></span><span></span></div>`;case"pulse":return r`<div class="pulse"></div>`;case"ring":return r`<div class="ring"></div>`;default:return r`<div class="spinner"></div>`}}static styles=n`
		:host {
			--spinner-size: 2rem;
			--spinner-border-width: 3px;
			--spinner-color: var(--c_primary);
			--spinner-track-color: var(--c_border);
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}
		/* Sizes */
		:host([size="xs"]) {
			--spinner-size: 1rem;
			--spinner-border-width: 2px;
		}
		:host([size="sm"]) {
			--spinner-size: 1.5rem;
			--spinner-border-width: 2px;
		}
		:host([size="md"]) {
			--spinner-size: 2rem;
			--spinner-border-width: 3px;
		}
		:host([size="lg"]) {
			--spinner-size: 3rem;
			--spinner-border-width: 4px;
		}
		:host([size="xl"]) {
			--spinner-size: 4rem;
			--spinner-border-width: 5px;
		}
		/* Spinner variant */
		.spinner {
			width: var(--spinner-size);
			height: var(--spinner-size);
			border: var(--spinner-border-width) solid var(--spinner-track-color);
			border-top-color: var(--spinner-color);
			border-radius: 50%;
			animation: spin 0.8s linear infinite;
		}
		@keyframes spin {
			to { transform: rotate(360deg); }
		}
		/* Dots variant */
		.dots {
			display: flex;
			gap: calc(var(--spinner-size) * 0.2);
		}
		.dots span {
			width: calc(var(--spinner-size) * 0.3);
			height: calc(var(--spinner-size) * 0.3);
			background: var(--spinner-color);
			border-radius: 50%;
			animation: bounce 1.4s ease-in-out infinite both;
		}
		.dots span:nth-child(1) { animation-delay: -0.32s; }
		.dots span:nth-child(2) { animation-delay: -0.16s; }
		.dots span:nth-child(3) { animation-delay: 0s; }
		@keyframes bounce {
			0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
			40% { transform: scale(1); opacity: 1; }
		}
		/* Bars variant */
		.bars {
			display: flex;
			align-items: center;
			gap: calc(var(--spinner-size) * 0.1);
			height: var(--spinner-size);
		}
		.bars span {
			width: calc(var(--spinner-size) * 0.15);
			height: 60%;
			background: var(--spinner-color);
			border-radius: calc(var(--spinner-size) * 0.05);
			animation: bars 1.2s ease-in-out infinite;
		}
		.bars span:nth-child(1) { animation-delay: -0.24s; }
		.bars span:nth-child(2) { animation-delay: -0.12s; }
		.bars span:nth-child(3) { animation-delay: 0s; }
		.bars span:nth-child(4) { animation-delay: 0.12s; }
		@keyframes bars {
			0%, 40%, 100% { height: 40%; }
			20% { height: 100%; }
		}
		/* Pulse variant */
		.pulse {
			width: var(--spinner-size);
			height: var(--spinner-size);
			background: var(--spinner-color);
			border-radius: 50%;
			animation: pulse 1.5s ease-in-out infinite;
		}
		@keyframes pulse {
			0% { transform: scale(0.8); opacity: 0.5; }
			50% { transform: scale(1); opacity: 1; }
			100% { transform: scale(0.8); opacity: 0.5; }
		}
		/* Ring variant */
		.ring {
			width: var(--spinner-size);
			height: var(--spinner-size);
			border: var(--spinner-border-width) solid var(--spinner-color);
			border-radius: 50%;
			animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		}
		@keyframes ring {
			0% { transform: rotate(0deg); border-color: var(--spinner-color) transparent transparent transparent; }
			25% { border-color: transparent var(--spinner-color) transparent transparent; }
			50% { border-color: transparent transparent var(--spinner-color) transparent; }
			75% { border-color: transparent transparent transparent var(--spinner-color); }
			100% { transform: rotate(360deg); border-color: var(--spinner-color) transparent transparent transparent; }
		}
	`}customElements.define("k-spinner",e);