import{html as t,css as e}from"../lit-all.min.js";import i from"./ShadowComponent.js";import{boolExists as r}from"../utils/propConverters.js";export default class a extends i{static properties={percentage:{type:String},offset:{type:String},color:{type:String},label:{type:Boolean,converter:r},indeterminate:{type:String,reflect:!0}};constructor(){super(),this.percentage="25",this.offset="0",this.color="var(--c_primary)",this.indeterminate=null}get bars(){const t=(this.percentage||"25").split("|").map(t=>t.trim()),e=(this.offset||0).split("|").map(t=>t.trim()),i=(this.color||"var(--c_primary)").split("|").map(t=>t.trim());return t.map((t,r)=>{let a=e[0];e.length>r&&(a=e[r]);let n=i[0];return i.length>r&&(n=i[r]),{percentage:t,offset:a,color:n}})}render(){const[{color:e}]=this.bars;return null!==this.indeterminate?t`
			<div id="bar1" class="bar indeterminate" style="background:${e};animation-duration:${this.indeterminate||"2s"}"></div>
			<div id="bar2" class="bar indeterminate" style="background:${e};animation-duration:${this.indeterminate||"2s"}"></div>
		`:t`${this.bars.map(({percentage:e,offset:i,color:r})=>t`
				<div 
					class="bar"
					style="left:${i}%;width:${e}%;background:${r}"
				>
					${this.label?t`<div class="label">${e}%</div>`:""}
				</div>
			`)}`}static styles=e`
		:host {
			--radius: 99999px;
			
			display: block;
			height: 1rem;
			width: 100%;
			background-color: var(--c_border);
			position: relative;
			overflow: hidden;
			color: var(--tc_on_primary);
			font-size: 0.75rem;
			border-radius: var(--radius);
		}

		.bar {
			display: flex;
			align-items: center;
			height: 100%;
			transition: width 0.3s ease;
			position: absolute;
			left: 0;
			border-radius: var(--radius);
		}
		.label {
			padding: 0 var(--spacer);
		}

		:host([indeterminate]) .bar {
			width: 25%;
			transition: none;
		}
		:host([indeterminate]) #bar1 {
			animation-name: indeterminate-bar1;
			animation-timing-function: linear;
			animation-iteration-count: infinite;
		}
		:host([indeterminate]) #bar2 {
			animation-name: indeterminate-bar2;
			animation-timing-function: linear;
			animation-iteration-count: infinite;
		}

		@keyframes indeterminate-bar1 {
			0% {
				left: 0%;
			}
			100% {
				left: 100%;
			}
		}
		@keyframes indeterminate-bar2 {
			0% {
				left: 0%;
				opacity: 1;
			}
			74% {
				opacity: 1;
			}
			75% {
				left: 75%;
				opacity: 0;
			}
			76% {
				left: -24%;
				opacity: 0;
			}
			76.5% {
				opacity: 1;
			}
			100% {
				left: 0%;
				opacity: 1;
			}
		}
	`}customElements.define("k-progress",a);