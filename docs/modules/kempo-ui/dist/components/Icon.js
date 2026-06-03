import t from"./ShadowComponent.js";import{html as i,css as e,unsafeHTML as n}from"../lit-all.min.js";const o={},s=async t=>(o[t]||(o[t]=new Promise(async(i,e)=>{const n=(new AbortController).signal;try{const e=await fetch(t,{signal:n});200===e.status?i(await e.text()):i(null)}catch(t){"AbortError"!==t.name&&e(t)}}).catch(()=>null)),await o[t]);export default class r extends t{static properties={src:{type:String,reflect:!0},name:{type:String,reflect:!0},rotation:{type:String,reflect:!0},direction:{type:String,reflect:!0},animation:{type:String,reflect:!0},iconContent:{type:String}};constructor(t=""){super(),this.src="",this.name=t,this.rotation="",this.direction="",this.animation="",this.iconContent=""}updated(t){super.updated(),(t.has("src")||t.has("name"))&&this.loadIcon()}async loadIcon(){let t;if(this.src?t=await s(this.src):this.name&&(t=await(t=>{const i=async i=>{const e=i.endsWith("/")?i.slice(0,-1):i;return s(`${e}/${t}.svg`)};return new Promise(async(t,e)=>{let n;const o=window.kempo?.pathsToIcons||["./icons","/icons","../icons","../../icons"];for(let t=0;t<o.length&&!n;t++)try{n=await i(o[t])}catch(t){}t(n||null)})})(this.name)),t)this.iconContent=this.fixSVG(t),this.requestUpdate();else{const t=this.innerHTML.trim();t?(this.iconContent=this.fixSVG(t),this.requestUpdate()):(this.iconContent=window.kempo?.fallbackIcon||'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path fill="currentColor" d="M480-79q-16 0-30.5-6T423-102L102-423q-11-12-17-26.5T79-480q0-16 6-31t17-26l321-321q12-12 26.5-17.5T480-881q16 0 31 5.5t26 17.5l321 321q12 11 17.5 26t5.5 31q0 16-5.5 30.5T858-423L537-102q-11 11-26 17t-31 6Zm0-80 321-321-321-321-321 321 321 321Zm-40-281h80v-240h-80v240Zm40 120q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Zm0-160Z"/></svg>',this.requestUpdate())}}fixSVG(t){if(!t)return t;const i=(new DOMParser).parseFromString(t,"image/svg+xml").querySelector("svg");return i?(i.removeAttribute("width"),i.removeAttribute("height"),i.querySelectorAll("path, rect, circle").forEach(t=>{t.setAttribute("fill","currentColor")}),(new XMLSerializer).serializeToString(i)):t}getRotationDegrees(){if(this.rotation)return this.rotation;return{down:"90",left:"180",up:"270"}[this.direction]||"0"}static styles=e`
		:host {
			display: inline-block;
			vertical-align: bottom;
		}
		::slotted(svg), svg {
			height: 1.35em;
			vertical-align: middle;
		}
		
		/* Rotation */
		:host([rotation]) svg,
		:host([direction]) svg {
			transform: rotate(var(--icon-rotation, 0deg));
		}
		
		/* Animations */
		:host([animation="spin"]) svg {
			animation: icon-spin 2s linear infinite;
		}
		:host([animation="blink"]) svg {
			animation: icon-blink 1s ease-in-out infinite;
		}
		:host([animation="pulse"]) svg {
			animation: icon-pulse 1.5s ease-in-out infinite;
		}
		
		@keyframes icon-spin {
			from { transform: rotate(0deg); }
			to { transform: rotate(360deg); }
		}
		
		@keyframes icon-blink {
			0%, 100% { opacity: 1; }
			50% { opacity: 0.2; }
		}
		
		@keyframes icon-pulse {
			0%, 100% { transform: scale(1); }
			50% { transform: scale(1.2); }
		}
	`;render(){const t=this.getRotationDegrees(),e="0"!==t?`--icon-rotation: ${t}deg;`:"";return this.iconContent?i`<div style="${e}">${n(this.iconContent)}</div>`:i`<div style="${e}"><slot></slot></div>`}}window.customElements.define("k-icon",r);