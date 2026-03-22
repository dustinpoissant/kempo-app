import ShadowComponent from"./ShadowComponent.js";import{html,css}from"../lit-all.min.js";import{boolExists}from"../utils/propConverters.js";import"./Icon.js";let nodeTagCounter=0;export default class Tree extends ShadowComponent{static properties={data:{type:Object},depth:{type:Number,reflect:!0},editable:{type:Boolean,converter:boolExists,attribute:"editable",reflect:!0}};constructor(){super(),this.data=null,this.depth=0,this.editable=!1}render(){if(null===this.data||void 0===this.data)return html`<slot></slot>`;if(Tree.nodes.find(e=>e.detect(this.data)))return html`
				<div class="tree-root">
					${Tree.renderValue(this.data,null,0,this.depth)}
				</div>
			`;const e=Array.isArray(this.data)?this.data.map((e,t)=>[t,e]):"object"==typeof this.data?Object.entries(this.data):null;return html`
			<div class="tree-root">
				${e?e.map(([e,t])=>Tree.renderValue(t,e,1,this.depth)):Tree.renderValue(this.data,null,0,this.depth)}
			</div>
		`}static nodes=[];static addNode=(...e)=>{[...e].reverse().forEach(e=>{Object.prototype.hasOwnProperty.call(e,"nodeTag")||(e.nodeTag="k-tree-node-"+nodeTagCounter++,window.customElements.define(e.nodeTag,e)),Tree.nodes.unshift(e)})};static renderValue(e,t=null,s=0,n=0){const r=Tree.nodes.find(t=>t.detect(e));if(r&&r.prototype.getChildren===TreeNode.prototype.getChildren){const s=null!==t?html`<span class="${"number"==typeof t?"tc-muted":""}">${t}: </span>`:"";return html`<span class="d-b">${s}${new r(e).renderLabel()}</span>`}const o=document.createElement((r??TreeNode).nodeTag);return o.value=e,o.key=t,o.depth=s,o.maxDepth=n,o}}window.customElements.define("k-tree",Tree);export class TreeNode extends ShadowComponent{static nodeTag="k-tree-node";static properties={value:{type:Object},key:{attribute:!1},depth:{type:Number},maxDepth:{type:Number},opened:{type:Boolean,converter:boolExists,reflect:!0},icon:{type:String}};constructor(e){super(),this.value=void 0!==e?e:null,this.key=null,this.depth=0,this.maxDepth=0,this.opened=!1,this.icon=null}connectedCallback(){super.connectedCallback(),this.depth<=this.maxDepth&&(this.opened=!0)}get tree(){return this.closest("k-tree")}toggle=()=>{this.opened=!this.opened};renderLabel(){return"object"==typeof this.value&&null!==this.value?html`${Array.isArray(this.value)?"Array":"Object"}`:html`${this.value}`}getChildren(){return"object"!=typeof this.value||null===this.value?null:Array.isArray(this.value)?this.value.map((e,t)=>[t,e]):Object.entries(this.value)}renderIcon(){return this.icon?html`<k-icon name="${this.icon}"></k-icon>`:html`<k-icon name="chevron" class="toggle-icon" direction="${this.opened?"down":"right"}"></k-icon>`}render(){const e=this.getChildren(),t=null!==this.key?html`<span class="${"number"==typeof this.key?"tc-muted":""}">${this.key}: </span>`:"";return e?html`
			<div>
				<button class="branch-label no-btn" @click=${this.toggle} aria-expanded="${this.opened}">
					${this.renderIcon()}
					${t}${this.renderLabel()}
				</button>
				${this.opened?html`
					<div class="pl">
						${e.map(([e,t])=>Tree.renderValue(t,e,this.depth+1,this.maxDepth))}
					</div>
				`:""}
			</div>
		`:html`<span class="d-b">${t}${this.renderLabel()}</span>`}static styles=css`
		:host{
			display: block;
		}
		.branch-label{
			display: block;
			width: 100%;
			cursor: pointer;
		}
		.branch-label:focus{
			box-shadow: none;
		}
		.branch-label:focus-visible{
			box-shadow: var(--focus_shadow);
		}
	`;static detect=()=>!1}window.customElements.define("k-tree-node",TreeNode);export class StringNode extends TreeNode{renderLabel(){return html`<span class="tc-success">"${this.value}"</span>`}static detect=e=>"string"==typeof e}export class NumberNode extends TreeNode{renderLabel(){return html`<span class="tc-primary">${this.value}</span>`}static detect=e=>"number"==typeof e}export class BooleanNode extends TreeNode{renderLabel(){return html`<span class="${this.value?"tc-success":"tc-danger"}">${this.value}</span>`}static detect=e=>"boolean"==typeof e}export class NullNode extends TreeNode{renderLabel(){return html`<span class="tc-muted">null</span>`}static detect=e=>null===e}export class UndefinedNode extends TreeNode{renderLabel(){return html`<span class="tc-muted">undefined</span>`}static detect=e=>void 0===e}Tree.addNode(StringNode,NumberNode,BooleanNode,NullNode,UndefinedNode);