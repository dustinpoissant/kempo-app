import{LitElement as e,html as t,css as i}from"../lit-all.min.js";import s from"./ShadowComponent.js";import r from"./Icon.js";import d from"../utils/drag.js";export default class n extends s{static properties={resizing:{type:String,reflect:!0},dimention:{type:String,reflect:!0},disabled:{type:Boolean,reflect:!0}};constructor(){super(),this.resizing="",this.dimension="",this.disabled=!1,this.startSize={width:0,height:0},this.cleanupFuncs=[]}firstUpdated(){super.firstUpdated(),this.setupDragHandlers()}disconnectedCallback(){super.disconnectedCallback(),this.cleanupFuncs.forEach(e=>e())}dragStartHandler=({element:e})=>{if(this.disabled)return;const{width:t,height:i}=this.getBoundingClientRect();this.startSize.width=t,this.startSize.height=i,this.resizing=e.id};dragEndHandler=()=>{this.resizing=""};dragSideHandler=({x:e})=>{this.disabled||(this.style.width=this.startSize.width+e+"px")};dragBottomHandler=({y:e})=>{this.disabled||(this.style.height=this.startSize.height+e+"px")};dragCornerHandler=({x:e,y:t})=>{this.disabled||(this.style.width=this.startSize.width+e+"px",this.style.height=this.startSize.height+t+"px")};setupDragHandlers(){const e=this.shadowRoot.getElementById("side"),t=this.shadowRoot.getElementById("bottom"),i=this.shadowRoot.getElementById("corner");e&&this.cleanupFuncs.push(d({element:e,startCallback:this.dragStartHandler,endCallback:this.dragEndHandler,callback:this.dragSideHandler,preventScroll:!0})),t&&this.cleanupFuncs.push(d({element:t,startCallback:this.dragStartHandler,endCallback:this.dragEndHandler,callback:this.dragBottomHandler,preventScroll:!0})),i&&this.cleanupFuncs.push(d({element:i,startCallback:this.dragStartHandler,endCallback:this.dragEndHandler,callback:this.dragCornerHandler,preventScroll:!0}))}static styles=i`
		:host {
			--handle_size: 1rem;

			display: grid;
			grid-template-columns: 1fr var(--handle_size);
			grid-template-rows: 1fr var(--handle_size);
			border: 1px solid var(--c_border);
			border-radius: var(--radius);
			min-width: 10rem;
			max-width: 100%;
			min-height: 10rem;
			max-height: 100%;
		}
		:host([dimension="height"]) {
			grid-template-columns: 1fr;
		}
		:host([dimension="width"]) {
			grid-template-rows: 1fr;
		}
		#main {
			grid-row: 1;
			grid-column: 1;
			overflow: auto;
		}
		#side {
			grid-row: 1;
			grid-column: 2;
			cursor: ew-resize;
		}
		#bottom {
			grid-row: 2;
			grid-column: 1;
			text-align: center;
			cursor: ns-resize;
		}
		#corner {
			grid-row: 2;
			grid-column: 2;
			overflow: hidden;
			cursor: nwse-resize;
		}
		.handle {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.handle svg {
			transform: scale(0.5);
		}
		#bottom svg {
			height: var(--handle_size);
		}
		#side svg {
			width: var(--handle_size);
		}
		#corner svg {
			width: var(--handle_size);
			height: var(--handle_size);
		}
		:host(:not([resizing=""])) #main {
			pointer-events: none;
			user-select: none;
		}
		:host([resizing="side"]) #side,
		:host([resizing="corner"]) #side,
		:host([resizing="corner"]) #corner,
		:host([resizing="corner"]) #bottom,
		:host([resizing="bottom"]) #bottom {
			background-color: var(--c_highlight);
		}
		:host([dimension="height"]) #side,
		:host([dimension="height"]) #corner,
		:host([dimension="width"]) #bottom,
		:host([dimension="width"]) #corner {
			display: none;
		}
		/* Disabled: handles can't capture pointer events, so a drag can't
		   start in the first place; visual cue: handles fade out and the
		   cursor reverts to default. */
		:host([disabled]) #side,
		:host([disabled]) #bottom,
		:host([disabled]) #corner {
			pointer-events: none;
			cursor: default;
			opacity: 0.4;
		}
	`;render(){return t`
			<div id="main">
				<slot></slot>
			</div>
			<div id="side" class="handle">
				<svg viewBox="0 0 15 64" xmlns="http://www.w3.org/2000/svg">
					<path fill="currentColor" d="m 15.000001,3 c 0,-1.661998 -1.115001,-3 -2.5,-3 -1.384999,0 -2.5,1.338002 -2.5,3 v 58 c 0,1.661998 1.115001,3 2.5,3 1.384999,0 2.5,-1.338002 2.5,-3 z M 5.0000008,3 c 0,-1.661998 -1.115001,-3 -2.5,-3 C 1.1150018,0 7.5891117e-7,1.338002 7.5891117e-7,3 v 58 c 0,1.661998 1.11500104108883,3 2.50000004108883,3 1.384999,0 2.5,-1.338002 2.5,-3 z" />
				</svg>
			</div>
			<div id="bottom" class="handle">
				<svg viewBox="0 0 64 15" xmlns="http://www.w3.org/2000/svg">
					<path fill="currentColor" d="M 3,0 C 1.3380017,0 0,1.1150014 0,2.5 0,3.8849986 1.3380017,5 3,5 H 61 C 62.661998,5 64,3.8849986 64,2.5 64,1.1150014 62.661998,0 61,0 Z M 3,10 C 1.3380017,10 0,11.115001 0,12.5 0,13.884999 1.3380017,15 3,15 h 58 c 1.661998,0 3,-1.115001 3,-2.5 C 64,11.115001 62.661998,10 61,10 Z" />
				</svg>
			</div>
			<div id="corner" class="handle">
				<svg version="1.1" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
					<path fill="currentColor" d="m12.735 3.0095e-4c-0.77288 0.011702-1.6098 0.36368-2.2773 1.0313l-9.4258 9.4258c-1.1868 1.1868-1.3772 2.908-0.42773 3.8574 0.94943 0.94943 2.6687 0.7571 3.8555-0.42969l9.4258-9.4258c1.1868-1.1868 1.3772-2.906 0.42774-3.8555-0.41537-0.41537-0.977-0.61262-1.5781-0.60352zm0 8.5684c-0.77288 0.011702-1.6098 0.36564-2.2773 1.0332l-0.85744 0.85546c-1.1868 1.1868-1.3772 2.908-0.42773 3.8574 0.94943 0.94943 2.6687 0.7571 3.8555-0.42969l0.85742-0.85742c1.1868-1.1868 1.3772-2.906 0.42773-3.8555-0.41537-0.41537-0.977-0.61262-1.5781-0.60352z" />
				</svg>
			</div>
		`}}customElements.define("k-resize",n);