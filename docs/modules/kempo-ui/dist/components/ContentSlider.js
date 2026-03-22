import ShadowComponent from"./ShadowComponent.js";import{html,css}from"../lit-all.min.js";import{boolTrueFalse}from"../utils/propConverters.js";import"./Icon.js";export default class ContentSlider extends ShadowComponent{static properties={index:{type:Number,reflect:!0},controls:{type:Boolean,reflect:!0,converter:boolTrueFalse},globalControls:{type:Boolean,reflect:!0,attribute:"global-controls",converter:boolTrueFalse},keyboardControls:{type:Boolean,reflect:!0,attribute:"keyboard-controls",converter:boolTrueFalse},loop:{type:Boolean,reflect:!0,converter:boolTrueFalse}};constructor(){super(),this.index=0,this.controls=!0,this.globalControls=!1,this.keyboardControls=!0,this.loop=!1,this.content=[],this.tabIndex=0}handlePrevClick=()=>{this.previous()};handleNextClick=()=>{this.next()};handleKeydown=t=>{"ArrowLeft"===t.code?(t.preventDefault(),this.dispatchEvent(new CustomEvent("keyleft")),this.previous()):"ArrowRight"===t.code&&(t.preventDefault(),this.dispatchEvent(new CustomEvent("keyright")),this.next())};connectedCallback(){super.connectedCallback(),this.updateContent(),this.setupKeyboardControls()}disconnectedCallback(){super.disconnectedCallback(),this.removeKeyboardControls()}updated(t){super.updated(t),t.has("index")&&(this.validateAndSetIndex(),this.renderContent(),this.dispatchEvent(new CustomEvent("change",{detail:{index:this.index}}))),(t.has("keyboardControls")||t.has("globalControls"))&&(this.removeKeyboardControls(),this.setupKeyboardControls())}updateContent(){this.content=[...this.querySelectorAll(":scope > *")],this.validateAndSetIndex(),this.renderContent()}validateAndSetIndex(){if(0===this.content.length)return;const t=Math.max(Math.min(this.content.length-1,this.index),0);this.index!==t&&(this.index=t)}renderContent(){0!==this.content.length&&(this.innerHTML="",this.content[this.index]&&this.appendChild(this.content[this.index]))}setupKeyboardControls(){this.keyboardControls&&(this.globalControls?window.addEventListener("keydown",this.handleKeydown):this.addEventListener("keydown",this.handleKeydown))}removeKeyboardControls(){window.removeEventListener("keydown",this.handleKeydown),this.removeEventListener("keydown",this.handleKeydown)}previous(){let t=this.index-1;this.loop&&t<0&&(t=this.content.length-1),this.dispatchEvent(new CustomEvent("previous",{detail:{index:t}})),this.index=t}next(){let t=this.index+1;this.loop&&t>=this.content.length&&(t=0),this.dispatchEvent(new CustomEvent("next",{detail:{index:t}})),this.index=t}goto(t){this.dispatchEvent(new CustomEvent("goto",{detail:{index:t}})),this.index=t}static styles=css`
		:host {
			display: block;
			position: relative;
			outline: none;
		}
		#prev,
		#next {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			font-size: 2rem;
		}
		#next {
			right: 0;
		}
		:host(:not([controls="true"])) #controls {
			display: none;
		}
	`;render(){return html`
			<div id="content">
				<slot></slot>
			</div>
			<div id="controls">
				<button
					id="prev"
					class="no-btn"
					@click=${this.handlePrevClick}
				>
					<slot name="prev">
						<k-icon name="chevron" direction="left"></k-icon>
					</slot>
				</button>
				<button
					id="next"
					class="no-btn"
					@click=${this.handleNextClick}
				>
					<slot name="next">
						<k-icon name="chevron"></k-icon>
					</slot>
				</button>
			</div>
		`}}customElements.define("k-content-slider",ContentSlider);