import ShadowComponent from"./ShadowComponent.js";import{html,css}from"../lit-all.min.js";import theme from"../utils/theme.js";export default class ThemeSelect extends ShadowComponent{static properties={currentTheme:{type:String,reflect:!0,attribute:"current-theme"}};constructor(){super(),this.currentTheme=theme.get()}handleChange=e=>{theme.set(e.target.value)};connectedCallback(){super.connectedCallback(),this.unsubscribe=theme.subscribe(e=>{this.currentTheme=e})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe&&this.unsubscribe()}render(){const e=this.childNodes.length>0;return html`
			${e?html`<label><slot></slot></label>`:""}
			<select @change=${this.handleChange} .value=${this.currentTheme}>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
				<option value="auto">System Default</option>
			</select>
		`}static styles=css`
		:host {
			display: block;
		}
	`;static setTheme(e){theme.set(e)}static getCurrentTheme(){return theme.get()}static getCalculatedCurrentTheme(){return theme.getCalculated()}}customElements.define("k-theme-select",ThemeSelect);