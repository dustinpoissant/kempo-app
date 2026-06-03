import{LitElement as e,html as o,css as t}from"../lit-all.min.js";import n from"./ShadowComponent.js";import s from"./Icon.js";import{boolExists as d}from"../utils/propConverters.js";export default class i extends n{static properties={opened:{type:Boolean,converter:d,reflect:!0}};constructor(){super(),this.opened=!1}updated(e){super.updated(e),e.has("opened")&&(this.dispatchEvent(new CustomEvent("change",{detail:{opened:this.opened}})),this.dispatchEvent(new CustomEvent(this.opened?"opened":"closed")))}handleToggleClick=()=>{this.toggle()};more(){this.opened=!0}less(){this.opened=!1}toggle(){this.opened=!this.opened}static styles=t`
		:host {
			--closed_height: 7rem;
			
			display: block;
		}
		:host(:not([opened])) #content {
			height: var(--closed_height);
			overflow-y: hidden;
		}
		:host(:not([opened])) #content {
			margin-bottom: calc(var(--closed_height) * -0.9);
		}
		:host(:not([opened])) #toggle {
			padding-top: calc(var(--closed_height) - 2rem);
			background: linear-gradient(to bottom, transparent 0%, var(--c_bg) 95%);
		}
		#toggle {
			width: 100%;
			padding: var(--spacer_h);
			text-align: center;
			background: var(--c_bg);
		}
		:host([opened]) #more,
		:host(:not([opened])) #less {
			display: none;
		}
	`;render(){return o`
			<div id="wrapper">
				<div id="content">
					<slot></slot>
				</div>
			<button id="toggle" @click=${this.handleToggleClick} class="no-btn">
				<span id="more">
					<slot name="more">Show More <k-icon name="chevron-double" direction="down"></k-icon></slot>
				</span>
				<span id="less">
					<slot name="less">Show Less <k-icon name="chevron-double" direction="up"></k-icon></slot>
				</span>
			</button>
			</div>
		`}}customElements.define("k-show-more",i);