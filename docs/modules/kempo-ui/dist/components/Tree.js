import e from"./ShadowComponent.js";import{html as t,css as s}from"../lit-all.min.js";import{boolExists as n}from"../utils/propConverters.js";import"./Icon.js";let r=0;export default class a extends e{static properties={data:{type:Object},depth:{type:Number,reflect:!0},editable:{type:Boolean,converter:n,attribute:"editable",reflect:!0}};constructor(){super(),this.data=null,this.depth=0,this.editable=!1}render(){if(null===this.data||void 0===this.data)return t`<slot></slot>`;if(a.nodes.find(e=>e.detect(this.data)))return t`
				<div class="tree-root">
					${a.renderValue(this.data,null,0,this.depth)}
				</div>
			`;const e=Array.isArray(this.data)?this.data.map((e,t)=>[t,e]):"object"==typeof this.data?Object.entries(this.data):null;return t`
			<div class="tree-root">
				${e?e.map(([e,t])=>a.renderValue(t,e,1,this.depth)):a.renderValue(this.data,null,0,this.depth)}
			</div>
		`}static nodes=[];static addNode=(...e)=>{[...e].reverse().forEach(e=>{Object.prototype.hasOwnProperty.call(e,"nodeTag")||(e.nodeTag="k-tree-node-"+r++,window.customElements.define(e.nodeTag,e)),a.nodes.unshift(e)})};static renderValue(e,s=null,n=0,r=0){const o=a.nodes.find(t=>t.detect(e));if(o&&o.prototype.getChildren===TreeNode.prototype.getChildren){const n=null!==s?t`<span class="${"number"==typeof s?"tc-muted":""}">${s}: </span>`:"";return t`<span class="d-b">${n}${new o(e).renderLabel()}</span>`}const d=document.createElement((o??TreeNode).nodeTag);return d.value=e,d.key=s,d.depth=n,d.maxDepth=r,d}}window.customElements.define("k-tree",a);export class TreeNode extends e{static nodeTag="k-tree-node";static properties={value:{type:Object},key:{attribute:!1},depth:{type:Number},maxDepth:{type:Number},opened:{type:Boolean,converter:n,reflect:!0},icon:{type:String}};constructor(e){super(),this.value=void 0!==e?e:null,this.key=null,this.depth=0,this.maxDepth=0,this.opened=!1,this.icon=null}connectedCallback(){super.connectedCallback(),this.depth<=this.maxDepth&&(this.opened=!0)}get tree(){return this.closest("k-tree")}toggle=()=>{this.opened=!this.opened};renderLabel(){return"object"==typeof this.value&&null!==this.value?t`${Array.isArray(this.value)?"Array":"Object"}`:t`${this.value}`}getChildren(){return"object"!=typeof this.value||null===this.value?null:Array.isArray(this.value)?this.value.map((e,t)=>[t,e]):Object.entries(this.value)}renderIcon(){return this.icon?t`<k-icon name="${this.icon}"></k-icon>`:t`<k-icon name="chevron" class="toggle-icon" direction="${this.opened?"down":"right"}"></k-icon>`}render(){const e=this.getChildren(),s=null!==this.key?t`<span class="${"number"==typeof this.key?"tc-muted":""}">${this.key}: </span>`:"";return e?t`
			<div>
				<button class="branch-label no-btn" @click=${this.toggle} aria-expanded="${this.opened}">
					${this.renderIcon()}
					${s}${this.renderLabel()}
				</button>
				${this.opened?t`
					<div class="pl">
						${e.map(([e,t])=>a.renderValue(t,e,this.depth+1,this.maxDepth))}
					</div>
				`:""}
			</div>
		`:t`<span class="d-b">${s}${this.renderLabel()}</span>`}static styles=s`
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
	`;static detect=()=>!1}window.customElements.define("k-tree-node",TreeNode);export class StringNode extends TreeNode{renderLabel(){return t`<span class="tc-success">"${this.value}"</span>`}static detect=e=>"string"==typeof e}export class NumberNode extends TreeNode{renderLabel(){return t`<span class="tc-primary">${this.value}</span>`}static detect=e=>"number"==typeof e}export class BooleanNode extends TreeNode{renderLabel(){return t`<span class="${this.value?"tc-success":"tc-danger"}">${this.value}</span>`}static detect=e=>"boolean"==typeof e}export class NullNode extends TreeNode{renderLabel(){return t`<span class="tc-muted">null</span>`}static detect=e=>null===e}export class UndefinedNode extends TreeNode{renderLabel(){return t`<span class="tc-muted">undefined</span>`}static detect=e=>void 0===e}a.addNode(StringNode,NumberNode,BooleanNode,NullNode,UndefinedNode);