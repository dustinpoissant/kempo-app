import{LitElement as t,html as e,css as r}from"../lit-all.min.js";import s from"../utils/drag.js";export class Sortable extends t{getCursorElement(){const t=Array.from(this.children).filter(t=>"K-SORTABLE-ITEM"===t.tagName&&!t.hasAttribute("sorting"));if(0===t.length)return null;const e=event.clientY;if(e<t[0].getBoundingClientRect().top)return[t[0],"before"];if(e>t[t.length-1].getBoundingClientRect().bottom)return[t[t.length-1],"after"];for(const r of t){const t=r.getBoundingClientRect();if(e<t.top+t.height/2)return[r,"before"];if(e<t.bottom)return[r,"after"]}return null}render(){return e`<slot></slot>`}static styles=r`
		:host {
			display: block;
		}
	`}customElements.define("k-sortable",Sortable);export class SortableItem extends t{static properties={sorting:{type:Boolean,reflect:!0}};constructor(){super(),this.cleanupDrag=null}firstUpdated(){this.setupDrag()}updated(t){super.updated(t),t.has("sorting")&&!this.sorting&&this.setupDrag()}disconnectedCallback(){super.disconnectedCallback(),this.cleanupDrag&&(this.cleanupDrag(),this.cleanupDrag=null)}setupDrag(){this.cleanupDrag&&this.cleanupDrag();const t=this.shadowRoot.getElementById("handle");t&&(this.cleanupDrag=s({element:t,startCallback:this.handleDragStart,moveCallback:this.handleDragMove,endCallback:this.handleDragEnd}))}handleDragStart=()=>{this.sorting=!0};handleDragMove=({y:t})=>{this.style.transform=`translateY(${t}px)`,this.style.zIndex="9999";const[e,r]=this.sortable.getCursorElement();Array.from(this.sortable.children).forEach(t=>{t.classList.remove("target-before","target-after")}),e&&e.classList.add(`target-${r}`)};handleDragEnd=()=>{this.sorting=!1,this.style.transform="",this.style.zIndex="";const[t,e]=this.sortable.getCursorElement();Array.from(this.sortable.children).forEach(t=>{t.classList.remove("target-before","target-after")}),t&&("before"===e?this.sortable.insertBefore(this,t):"after"===e&&this.sortable.insertBefore(this,t.nextSibling),this.sortable.dispatchEvent(new CustomEvent("sort",{bubbles:!0})))};get sortable(){return this.closest("k-sortable")}render(){return e`
			<div id="handle">
				<k-icon name="drag-handle"></k-icon>
			</div>
			<div id="content" class="p pl0">
				<slot></slot>
			</div>
		`}static styles=r`
		:host {
			display: block;
			border: 1px solid var(--c_border);
			user-select: none;
			position: relative;
		}
		:host([sorting]){
			opacity: 0.8;
		}
		#handle {
			display: inline-block;
			cursor: pointer;
			padding: var(--spacer);
		}
		#content {
			display: inline-block;
		}
		:host(.target-before)::before,
		:host(.target-after)::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			height: 4px;
			background-color: var(--c_primary);
		}
		:host(.target-before)::before {
			top: -2px;
		}
		:host(.target-after)::after {
			bottom: -2px;
		}
	`}customElements.define("k-sortable-item",SortableItem);