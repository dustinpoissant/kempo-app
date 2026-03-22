import ShadowComponent from"../ShadowComponent.js";import{html,css}from"../../lit-all.min.js";export default class TableControl extends ShadowComponent{static properties={maxWidth:{type:Number,reflect:!0,attribute:"max-width"}};constructor({maxWidth:t=40}={}){super(),this.maxWidth=t}updated(t){super.updated(t),t.has("maxWidth")&&(this.maxWidth?this.style.setProperty("--max-width",`${this.maxWidth}px`):this.style.removeProperty("--max-width"))}firstUpdated(){this.maxWidth?this.style.setProperty("--max-width",`${this.maxWidth}px`):this.style.removeProperty("--max-width")}get table(){return this.getRootNode()instanceof ShadowRoot?this.getRootNode().host.closest("k-table"):this.closest("k-table")}get record(){if(this.getRootNode()instanceof ShadowRoot){const t=this.closest(".record");if(t){const e=t.dataset.index;if(void 0!==e)return this.table.records[e]}}return!1}async onTableEvent(t,e){if(await customElements.whenDefined("k-table"),this.table){t.split(" ").forEach(t=>{this.table.addEventListener(t,e)}),this.requestUpdate()}}static styles=css`
		:host {
			display: inline-flex;
		}
		
		.icon-btn {
			display: inline-flex !important;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
		}
		.icon-btn:disabled {
			opacity: 0.6;
		}
	`}customElements.define("k-table-control",TableControl);