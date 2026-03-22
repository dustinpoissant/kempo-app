import ShadowComponent from"./ShadowComponent.js";import{html,css}from"../lit-all.min.js";import theme from"../utils/theme.js";import"./Icon.js";export default class ThemeSwitcher extends ShadowComponent{static properties={currentTheme:{type:String,reflect:!0,attribute:"current-theme"}};constructor(){super(),this.currentTheme=theme.get()}handleClick=()=>{const e=theme.get();"auto"===e&&theme.set("light"),"light"===e&&theme.set("dark"),"dark"===e&&theme.set("auto")};connectedCallback(){super.connectedCallback(),this.unsubscribe=theme.subscribe(e=>{this.currentTheme=e})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe&&this.unsubscribe()}static styles=css`
		:host {
			--padding: var(--spacer);
			display: flex;
		}
		button {
			padding: var(--padding);
		}
	`;render(){const e="auto"===this.currentTheme?"mode-auto":"light"===this.currentTheme?"mode-light":"mode-dark";return html`
			<button
				class="no-btn"
				@click=${this.handleClick}
			>
				<k-icon name=${e}></k-icon>
			</button>
		`}static styles=css`
		:host {
			--padding: var(--spacer, 1rem);
		}
		button.no-btn {
			padding: var(--padding);
			border-radius: var(--radius);
		}
	`;static setTheme(e){theme.set(e)}static getCurrentTheme(){return theme.get()}static getCalculatedCurrentTheme(){return theme.getCalculated()}}customElements.define("k-theme-switcher",ThemeSwitcher);