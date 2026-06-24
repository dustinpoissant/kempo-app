import e from"./ShadowComponent.js";import{html as t,css as n,render as o}from"../lit-all.min.js";import{boolExists as l}from"../utils/propConverters.js";import"./Icon.js";export default class i extends e{static properties={src:{type:String,reflect:!0},alt:{type:String,reflect:!0},fullscreen:{type:Boolean,reflect:!0,converter:l},keyboardControls:{type:Boolean,reflect:!0,attribute:"keyboard-controls",converter:l},global:{type:Boolean,reflect:!0,converter:l}};constructor(){super(),this.src="",this.alt="",this.fullscreen=!1,this.keyboardControls=!0,this.global=!1}handleImageClick=()=>{this.open()};handleImageKeydown=e=>{"Enter"!==e.key||this.fullscreen||this.open()};handleCloseClick=()=>{this.close()};handleOverlayClick=e=>{e.target===e.currentTarget&&this.close()};handlePrevClick=e=>{e.stopPropagation();const t=this.getPrevSibling();t&&(this.close(),t.open())};handleNextClick=e=>{e.stopPropagation();const t=this.getNextSibling();t&&(this.close(),t.open())};handleKeydown=e=>{if("Escape"===e.key)this.close();else if("ArrowLeft"===e.key){const e=this.getPrevSibling();e&&(this.close(),e.open())}else if("ArrowRight"===e.key){const e=this.getNextSibling();e&&(this.close(),e.open())}};connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this.keyboardControls&&document.removeEventListener("keydown",this.handleKeydown)}updated(e){if(super.updated(e),e.has("fullscreen")){this.dispatchEvent(new CustomEvent("fullscreenchange",{detail:{fullscreen:this.fullscreen}})),this.dispatchEvent(new CustomEvent(this.fullscreen?"fullscreen":"fullscreenclose")),this.updateNavigationState(),document.body.classList.toggle("no-scroll",this.fullscreen);const e=this.closest("[data-overlay-root]");e&&e.classList.toggle("no-scroll",this.fullscreen),this.keyboardControls&&(this.fullscreen?document.addEventListener("keydown",this.handleKeydown):document.removeEventListener("keydown",this.handleKeydown))}(e.has("src")||e.has("alt"))&&this.handleFullscreenCaption()}firstUpdated(){this.handleFullscreenCaption()}open(){this.fullscreen=!0}close(){this.fullscreen=!1}toggle(){this.fullscreen=!this.fullscreen}static open(e,t=0,n={}){const{keyboardControls:l=!0,onClose:i}=n,s=document.createElement("div");s.style.position="fixed",s.style.top="0",s.style.left="0",s.style.width="0",s.style.height="0",s.style.overflow="hidden",s.style.zIndex="80";const r=e.map(e=>{const t=document.createElement("k-photo-viewer");return t.src=e.src,t.alt=e.alt||"",t.keyboardControls=l,void 0!==e.caption&&("string"==typeof e.caption?t.innerHTML=e.caption:o(e.caption,t)),s.appendChild(t),t});(document.querySelector("[data-overlay-root]")||document.body).appendChild(s);const a=()=>{r.some(e=>e.fullscreen)||(r.forEach(e=>e.removeEventListener("fullscreenclose",a)),s.remove(),i?.())};r.forEach(e=>e.addEventListener("fullscreenclose",a));const c=Math.min(Math.max(t,0),r.length-1);return r[c].open(),r[c]}getPrevSibling(){if(this.global){const e=Array.from(document.getElementsByTagName("k-photo-viewer")),t=e.indexOf(this);return-1===t?null:e[0===t?e.length-1:t-1]}{let e=this.previousElementSibling;for(;e&&"K-PHOTO-VIEWER"!==e.tagName;)e=e.previousElementSibling;if(!e&&this.hasPhotoSiblings())for(e=this.parentElement.lastElementChild;e&&"K-PHOTO-VIEWER"!==e.tagName;)e=e.previousElementSibling;return e}}getNextSibling(){if(this.global){const e=Array.from(document.getElementsByTagName("k-photo-viewer")),t=e.indexOf(this);return-1===t?null:e[t===e.length-1?0:t+1]}{let e=this.nextElementSibling;for(;e&&"K-PHOTO-VIEWER"!==e.tagName;)e=e.nextElementSibling;if(!e&&this.hasPhotoSiblings())for(e=this.parentElement.firstElementChild;e&&"K-PHOTO-VIEWER"!==e.tagName;)e=e.nextElementSibling;return e}}hasPhotoSiblings(){return this.global?document.getElementsByTagName("k-photo-viewer").length>1:Array.from(this.parentElement.children).filter(e=>e!==this&&"K-PHOTO-VIEWER"===e.tagName).length>0}updateNavigationState(){const e=this.fullscreen&&this.hasPhotoSiblings();this.shadowRoot.querySelectorAll(".nav-btn").forEach(t=>{t.style.display=e?"":"none"})}async handleFullscreenCaption(){await this.updateComplete;const e=this.shadowRoot.querySelector('slot[name="fullscreen-caption"]');if(e&&!e.assignedNodes().length){const e=this.shadowRoot.querySelector("slot:not([name])");(e?e.assignedNodes():[]).forEach(e=>{if(e.nodeType===Node.ELEMENT_NODE){const t=e.cloneNode(!0);t.slot="fullscreen-caption",this.appendChild(t)}})}}static styles=n`
		:host {
			display: block;
		}
		#wrapper {
			position: relative;
			width: 100%;
			height: 100%;
		}
		#img {
			max-width: 100%;
			height: auto;
			cursor: pointer;
			outline: none;
			border-radius: var(--img_radius, 0);
		}
		#img:focus {
			box-shadow: var(--focus_shadow);
		}
		#fullscreen-overlay {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 80;
			background: rgba(0,0,0,0.9);
			padding: 2rem;
			display: none;
		}
		:host([fullscreen]) #fullscreen-overlay {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.content {
			position: relative;
			max-width: 100%;
			max-height: 90vh;
		}
		#fullscreen-img {
			max-height: 75vh;
			max-width: 100%;
			object-fit: contain;
			cursor: default;
		}
		#close {
			position: absolute;
			top: 1rem;
			right: 1rem;
			z-index: 1;
			background: none;
			border: none;
			color: white;
			cursor: pointer;
		}
		.nav-btn {
			position: fixed;
			top: 50%;
			transform: translateY(-50%);
			z-index: 1;
			background: none;
			border: none;
			color: white;
			cursor: pointer;
			padding: 1rem;
			opacity: 0.7;
			font-size: 3rem;
			-webkit-text-stroke: 1px black;
			text-stroke: 1px black;
			text-shadow: 0 0 3px rgba(0,0,0,0.8);
		}
		.nav-btn::slotted(*),
		.nav-btn k-icon {
			filter: drop-shadow(0 0 2px rgba(0,0,0,1)) drop-shadow(0 0 2px rgba(0,0,0,1));
		}
		.nav-btn:hover {
			opacity: 1;
		}
		#prev {
			left: 1rem;
		}
		#next {
			right: 1rem;
		}
		.caption {
			text-align: center;
			max-width: 600px;
			width: fit-content;
			margin: 1rem auto 0;
		}
		#fullscreen-overlay .caption {
			color: white;
		}
		:host([fullscreen]) .caption {
			color: white;
		}
	`;render(){return t`
			<div id="wrapper">
				<img 
					id="img" 
					src="${this.src}" 
					alt="${this.alt}" 
					tabindex="0"
					@click=${this.handleImageClick}
					@keydown=${this.handleImageKeydown}
				/>
				<div class="caption">
					<slot></slot>
				</div>
				<div id="fullscreen-overlay" @click=${this.handleOverlayClick}>
					<button id="close" class="no-btn" @click=${this.handleCloseClick}>
						<slot name="close">
							<k-icon name="close"></k-icon>
						</slot>
					</button>
					<button id="prev" class="nav-btn no-btn" @click=${this.handlePrevClick}>
						<slot name="prev">
							<k-icon name="chevron" direction="left"></k-icon>
						</slot>
					</button>
					<button id="next" class="nav-btn no-btn" @click=${this.handleNextClick}>
						<slot name="next">
							<k-icon name="chevron"></k-icon>
						</slot>
					</button>
					<div class="content">
						<img id="fullscreen-img" src="${this.src}" alt="${this.alt}" />
						<div class="caption">
							<slot name="fullscreen-caption"></slot>
						</div>
					</div>
				</div>
			</div>
		`}}customElements.define("k-photo-viewer",i);