import{html as e,css as t}from"../lit-all.min.js";import i from"./ShadowComponent.js";import s from"../utils/drag.js";import{boolExists as r}from"../utils/propConverters.js";export default class d extends i{static properties={resizing:{type:Boolean,reflect:!0},stacked:{type:Boolean,reflect:!0},stackWidth:{type:Number,attribute:"stack-width"},direction:{type:String,reflect:!0},persistentId:{type:String,reflect:!0,attribute:"persistent-id"},grip:{type:Boolean,reflect:!0,converter:r}};constructor(){super(),this.resizing=!1,this.stacked=!1,this.stackWidth=0,this.direction="horizontal",this.persistentId=null,this.grip=!1,this.dragStartSize=0,this.dragCleanup=()=>{},this.resizeObserver=null}firstUpdated(){if(super.firstUpdated(),this.grip){const e=document.createElement("div");e.style.cssText="position:absolute;visibility:hidden;width:var(--handle_width)",this.shadowRoot.appendChild(e);const t=e.offsetWidth;this.shadowRoot.removeChild(e);const i=t%2==0?t-1:t;this.style.setProperty("--handle_grip_width",`${i}px`)}if(this.setupDragHandler(),this.setupResizeObserver(),this.persistentId&&window?.localStorage){const e=window.localStorage.getItem(`split-persistent-id-${this.persistentId}`);e&&this.setSize(e)}}disconnectedCallback(){super.disconnectedCallback(),this.dragCleanup(),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null)}handleDragStart=()=>{this.resizing=!0,this.dragStartSize=Math.round(this.shadowRoot.getElementById("pane-1").getBoundingClientRect()["vertical"===this.direction?"height":"width"]),this.dispatchEvent(new CustomEvent("resizestart",{detail:{startSize:this.dragStartSize},bubbles:!0}))};handleDrag=({x:e,y:t})=>{const i="vertical"===this.direction?t:e,s=`${this.dragStartSize+i}px`;this.setSize(s),this.dispatchEvent(new CustomEvent("resize",{detail:{size:s},bubbles:!0}))};handleDragEnd=({x:e,y:t})=>{this.resizing=!1;const i="vertical"===this.direction?t:e,s=`${this.dragStartSize+i}px`;this.setSize(s),this.persistentId&&window?.localStorage&&window.localStorage.setItem(`split-persistent-id-${this.persistentId}`,s),this.dispatchEvent(new CustomEvent("resizeend",{detail:{size:s},bubbles:!0}))};setSize(e){this.style.setProperty("--pane_1_size",e)}setupDragHandler(){const e=this.shadowRoot.getElementById("divider-handle");e&&(this.dragCleanup=s({element:e,callback:this.handleDrag,startCallback:this.handleDragStart,endCallback:this.handleDragEnd}))}setupResizeObserver(){this.resizeObserver=new ResizeObserver(e=>{for(const t of e){const e=t.contentRect.width;this.stacked=e<=this.stackWidth}}),this.resizeObserver.observe(this)}render(){return e`
			<div id="pane-1" class="pane">
				<slot></slot>
			</div>
			<div id="divider-handle">
				<div id="divider-border">
          ${this.grip?e`<div id="divider-grip"></div>`:""}
        </div>
			</div>
			<div id="pane-2" class="pane">
				<slot name="right"></slot>
			</div>
		`}static styles=t`
		:host {
			--pane_1_size: calc((100% - var(--handle_width)) / 2);
			--handle_width: 7px;
			--min_pane_size: 6rem;

			height: 100%;
			display: flex;
			align-items: stretch;
			flex: 1 1 auto;
			overflow: hidden;
		}

		.pane, #divider-handle {
			display: inline-block;
		}

		.pane {
			min-width: var(--min_pane_size);
			max-width: calc(100% - var(--min_pane_size) - var(--handle_width));
			max-height: 100%;
			overflow: hidden;
		}

		#pane-1 {
			flex: 0 0 var(--pane_1_size);
		}

		#divider-handle {
			position: relative;
			display: flex;
			flex-shrink: 0;
			justify-content: center;
			width: var(--handle_width);
			cursor: ew-resize;
		}

		:host([resizing]) #divider-handle {
			background-color: var(--tc_primary);
		}

		:host([resizing]) {
			user-select: none;
		}

		:host([resizing]) .pane {
			pointer-events: none;
		}

		#divider-border {
			position: relative;
			width: 1px;
			height: 100%;
			border-left: 1px solid var(--c_border);
		}
		#divider-grip {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: var(--handle_grip_width, var(--handle_width));
			height: 2rem;
			border-radius: 0.25rem;
			background-color: var(--c_border);
		}

		#pane-2 {
			flex: 1 1;
		}

		:host([stacked]) #pane-1,
		:host([stacked]) #pane-2 {
			display: block;
		}

		:host([stacked]) #divider-handle {
			display: none;
		}

		:host([stacked]) .pane {
			min-width: 0;
			max-width: 100%;
			max-height: none;
			overflow: auto;
		}

		:host([stacked]) {
			display: block;
		}

		:host([direction="vertical"]) {
			flex-direction: column;
		}

		:host([direction="vertical"]) .pane {
			min-width: 0;
			max-width: 100%;
			min-height: var(--min_pane_size);
			max-height: calc(100% - var(--min_pane_size) - var(--handle_width));
		}

		:host([direction="vertical"]) #pane-1 {
			flex: 0 0 var(--pane_1_size);
		}

		:host([direction="vertical"]) #divider-handle {
			width: 100%;
			height: var(--handle_width);
			cursor: ns-resize;
			align-items: center;
			justify-content: initial;
		}

		:host([direction="vertical"]) #divider-border {
			width: 100%;
			height: 1px;
			border-left: none;
			border-top: 1px solid var(--c_border);
		}
		:host([direction="vertical"]) #divider-grip {
			width: 2rem;
			height: 0.5rem;
		}
	`}customElements.define("k-split",d);