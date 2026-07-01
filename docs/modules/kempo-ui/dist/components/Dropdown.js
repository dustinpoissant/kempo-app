import{html as e,css as t}from"../lit-all.min.js";import o from"./ShadowComponent.js";import{boolTrueFalse as n}from"../utils/propConverters.js";const i=new Set;export default class s extends o{static properties={opened:{type:Boolean,reflect:!0},openDirection:{type:String,reflect:!0,attribute:"open-direction"},closeOnSelect:{type:Boolean,reflect:!0,attribute:"close-on-select",converter:n},closeOnClickOutside:{type:Boolean,reflect:!0,attribute:"close-on-click-outside",converter:n},submenu:{type:Boolean,reflect:!0},hover:{type:Boolean,reflect:!0}};constructor(){super(),this.opened=!1,this.openDirection="down left",this.closeOnSelect=!0,this.closeOnClickOutside=!0,this.submenu=!1,this.hover=!1}connectedCallback(){super.connectedCallback(),"K-DROPDOWN"!==this.parentElement?.tagName||this.hasAttribute("slot")||(this.submenu=!0,this.hasAttribute("open-direction")||(this.openDirection="right down")),this.submenu?(this.addEventListener("mouseenter",this.handleSubmenuEnter),this.addEventListener("mouseleave",this.handleSubmenuLeave)):(document.addEventListener("click",this.handleDocumentClick),this.hover&&(this.addEventListener("mouseenter",this.handleHoverEnter),this.addEventListener("mouseleave",this.handleHoverLeave))),document.addEventListener("keydown",this.handleKeydown)}disconnectedCallback(){super.disconnectedCallback(),this.submenu?(this.removeEventListener("mouseenter",this.handleSubmenuEnter),this.removeEventListener("mouseleave",this.handleSubmenuLeave)):(document.removeEventListener("click",this.handleDocumentClick),this.removeEventListener("mouseenter",this.handleHoverEnter),this.removeEventListener("mouseleave",this.handleHoverLeave)),document.removeEventListener("keydown",this.handleKeydown),i.delete(this)}updated(e){super.updated(e),e.has("opened")&&(this.submenu||(this.opened?i.add(this):i.delete(this)),this.dispatchEvent(new CustomEvent(this.opened?"opened":"closed",{bubbles:!0})))}handleDocumentClick=e=>{const t=e.composedPath(),o=t.find(e=>e.matches?.('[slot="trigger"]'));if(o){const e=o.closest("k-dropdown");if(e===this)return;if(this.contains(e))return;return void(this.opened&&this.close())}if(!this.opened)return;if(!t.includes(this))return void(this.closeOnClickOutside&&this.close());const n=t.find(e=>e.matches?.("a, button"));n&&!n.closest('[slot="trigger"]')&&this.closeOnSelect&&this.close()};handleTriggerClick=e=>{this.hover||(e.stopPropagation(),this.opened||i.forEach(e=>{e!==this&&e.close()}),this.toggle())};handleMenuClick=e=>{const t=e.target.closest("a, button");if(!t||t.hasAttribute("disabled"))return;if(t.closest("k-dropdown")!==this)return;const o=t.dataset?.value||t.textContent.trim();this.dispatchEvent(new CustomEvent("select",{detail:{value:o,item:t},bubbles:!0}))};handleKeydown=e=>{if(!this.opened)return;const t=document.activeElement;if(!this.contains(t))return;const o=this.querySelector(":scope > k-dropdown[opened]");if(!o?.contains(t))if("Escape"===e.key||this.submenu&&"ArrowLeft"===e.key)e.preventDefault(),this.close(),this.focusTrigger();else if("ArrowDown"===e.key)e.preventDefault(),this.focusNextItem();else if("ArrowUp"===e.key)e.preventDefault(),this.focusPreviousItem();else if("ArrowRight"===e.key){const o=t?.closest("k-dropdown[submenu]");o?.parentElement===this&&(e.preventDefault(),o.open(),o.focusFirstItem())}else if("Enter"===e.key||" "===e.key){const o=t?.closest("k-dropdown[submenu]");o?.parentElement===this?(e.preventDefault(),o.open(),o.focusFirstItem()):t&&!t.closest('[slot="trigger"]')&&(e.preventDefault(),t.click())}};open(){return this.submenu?[...this.parentElement.querySelectorAll(":scope > k-dropdown[opened]")].forEach(e=>{e!==this&&e.close()}):i.forEach(e=>{e!==this&&e.close()}),this.opened=!0,this.submenu||requestAnimationFrame(()=>this.focusFirstItem()),this}close(){return this.querySelectorAll(":scope > k-dropdown[opened]").forEach(e=>e.close()),this.opened=!1,this}toggle(){return this.opened?this.close():this.open()}focusTrigger(){const e=this.querySelector('[slot="trigger"]');e&&e.focus()}getMenuItems(){return[...this.children].reduce((e,t)=>{if(t.matches('[slot="trigger"]')||t.hasAttribute("disabled"))return e;if("K-DROPDOWN"===t.tagName){const o=t.querySelector('[slot="trigger"]');o&&e.push(o)}else t.matches("a, button")&&e.push(t);return e},[])}focusFirstItem(){const e=this.getMenuItems();e.length>0&&e[0].focus()}focusNextItem(){const e=this.getMenuItems(),t=document.activeElement,o=e.indexOf(t),n=e[o+1]||e[0];n&&n.focus()}focusPreviousItem(){const e=this.getMenuItems(),t=document.activeElement,o=e.indexOf(t),n=e[o-1]||e[e.length-1];n&&n.focus()}static styles=t`
		:host {
			display: inline-block;
			position: relative;
			white-space: normal;
		}
		#trigger {
			display: inline-flex;
			align-items: center;
			cursor: pointer;
			anchor-name: --dropdown-trigger;
		}
		#menu {
			display: none;
			position: fixed;
			position-anchor: --dropdown-trigger;
			z-index: 30;
			min-width: anchor-size(width);
			background: var(--c_bg);
			border: 1px solid var(--c_border);
			border-radius: var(--radius);
			box-shadow: var(--drop_shadow);
			margin: 0.25rem;
			overflow: hidden;
		}
		:host([opened]) #menu {
			display: block;
		}
		:host([submenu]) #menu {
			margin: 0;
		}
		/* Default: down left */
		#menu {
			position-area: bottom span-right;
			position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
		}
		/* down right */
		:host([open-direction="down right"]) #menu {
			position-area: bottom span-left;
		}
		/* down center */
		:host([open-direction="down center"]) #menu,
		:host([open-direction="down"]) #menu {
			position-area: bottom center;
		}
		/* up left */
		:host([open-direction="up left"]) #menu {
			position-area: top span-right;
		}
		/* up right */
		:host([open-direction="up right"]) #menu {
			position-area: top span-left;
		}
		/* up center */
		:host([open-direction="up center"]) #menu,
		:host([open-direction="up"]) #menu {
			position-area: top center;
		}
		/* left up */
		:host([open-direction="left up"]) #menu {
			position-area: left span-top;
		}
		/* left down */
		:host([open-direction="left down"]) #menu {
			position-area: left span-bottom;
		}
		/* left center */
		:host([open-direction="left center"]) #menu,
		:host([open-direction="left"]) #menu {
			position-area: left center;
		}
		/* right up */
		:host([open-direction="right up"]) #menu {
			position-area: right span-top;
		}
		/* right down */
		:host([open-direction="right down"]) #menu {
			position-area: right span-bottom;
		}
		/* right center */
		:host([open-direction="right center"]) #menu,
		:host([open-direction="right"]) #menu {
			position-area: right center;
		}
		/* Slotted menu item styles (not trigger) */
		::slotted(a:not([slot="trigger"])),
		::slotted(button:not([slot="trigger"])) {
			all: unset !important;
			display: block !important;
			box-sizing: border-box !important;
			width: 100% !important;
			padding: var(--spacer_h) var(--spacer) !important;
			color: var(--tc) !important;
			background: transparent !important;
			border: none !important;
			border-top: 1px solid var(--c_border) !important;
			border-radius: 0 !important;
			font: inherit !important;
			text-align: left !important;
			cursor: pointer !important;
			white-space: nowrap !important;
			transition: background var(--animation_ms) !important;
		}
		::slotted(a.k-dropdown-first),
		::slotted(button.k-dropdown-first) {
			border-top: none !important;
		}
		::slotted(a:not([slot="trigger"]):hover),
		::slotted(a:not([slot="trigger"]):focus-visible),
		::slotted(button:not([slot="trigger"]):hover),
		::slotted(button:not([slot="trigger"]):focus-visible) {
			background: var(--c_bg__alt) !important;
			outline: none !important;
		}
		::slotted(a:not([slot="trigger"])[disabled]),
		::slotted(button:not([slot="trigger"])[disabled]) {
			opacity: 0.5 !important;
			cursor: not-allowed !important;
			pointer-events: none !important;
		}
		::slotted(hr) {
			display: none !important;
		}
		/* Slotted submenu dropdowns */
		::slotted(k-dropdown) {
			display: block !important;
			width: 100% !important;
			border-top: 1px solid var(--c_border) !important;
		}
		::slotted(k-dropdown.k-dropdown-first) {
			border-top: none !important;
		}
		/* Submenu host styles */
		:host([submenu]) {
			display: block;
			position: relative;
		}
		:host([submenu]) #trigger {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			padding: var(--spacer_h) var(--spacer);
			cursor: pointer;
			white-space: nowrap;
			transition: background var(--animation_ms);
		}
		:host([submenu]) #trigger:hover,
		:host([submenu]) #trigger:focus-within {
			background: var(--c_bg__alt);
		}
		:host([submenu]) #trigger ::slotted(button),
		:host([submenu]) #trigger ::slotted(a) {
			all: unset !important;
			cursor: pointer !important;
			font: inherit !important;
			color: var(--tc) !important;
		}
		:host([submenu]) #trigger k-icon {
			font-size: 0.75em;
			opacity: 0.6;
		}
	`;handleHoverEnter=()=>{clearTimeout(this.closeTimer),this.opened||this.open()};handleHoverLeave=()=>{this.closeTimer=setTimeout(()=>this.close(),150)};handleSubmenuEnter=()=>{clearTimeout(this.closeTimer),this.opened||this.open()};handleSubmenuLeave=()=>{this.closeTimer=setTimeout(()=>this.close(),150)};handleSlotChange=e=>{e.target.assignedElements().filter(e=>e.matches("a, button, k-dropdown")).forEach((e,t)=>e.classList.toggle("k-dropdown-first",0===t))};render(){return e`
			<div id="trigger" @click=${this.handleTriggerClick}>
				<slot name="trigger"></slot>
				${this.submenu?e`<k-icon name="chevron"></k-icon>`:""}
			</div>
			<div id="menu" part="menu" role="menu" @click=${this.handleMenuClick}>
				<slot @slotchange=${this.handleSlotChange}></slot>
			</div>
		`}}customElements.define("k-dropdown",s);