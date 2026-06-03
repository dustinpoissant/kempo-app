import e from"./ShadowComponent.js";import{html as t,css as s}from"../lit-all.min.js";import r from"../utils/theme.js";export default class l extends e{static properties={currentTheme:{type:String,reflect:!0,attribute:"current-theme"}};constructor(){super(),this.currentTheme=r.get()}handleChange=e=>{r.set(e.target.value)};connectedCallback(){super.connectedCallback(),this.unsubscribe=r.subscribe(e=>{this.currentTheme=e})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe&&this.unsubscribe()}render(){const e=this.childNodes.length>0;return t`
			${e?t`<label><slot></slot></label>`:""}
			<select @change=${this.handleChange} .value=${this.currentTheme}>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
				<option value="auto">System Default</option>
			</select>
		`}static styles=s`
		:host {
			display: block;
		}
	`;static setTheme(e){r.set(e)}static getCurrentTheme(){return r.get()}static getCalculatedCurrentTheme(){return r.getCalculated()}}customElements.define("k-theme-select",l);