import{html as t,css as e,nothing as s}from"../lit-all.min.js";import a from"./ShadowComponent.js";import{bound as i,closest as r}from"../utils/number.js";import{commaSeparatedArray as o}from"../utils/propConverters.js";import l from"./controls/Control.js";export default class g extends a{static properties={page:{type:Number,reflect:!0,attribute:"page"},totalItems:{type:Number,reflect:!0,attribute:"total-items"},itemsPerPage:{type:Number,reflect:!0,attribute:"items-per-page"},controls:{type:String,reflect:!0},pageSizes:{converter:o(t=>{const e=parseInt(t);return isNaN(e)?null:e},[5,10,25,50,100]),reflect:!0,attribute:"page-sizes"}};constructor(){super(),this.page=1,this.totalItems=0,this.itemsPerPage=10,this.pageSizes=[5,10,25,50,100],this.controls=""}connectedCallback(){super.connectedCallback(),this.hasAttribute("controlled")||this.setAttribute("controlled","")}loadControls(){const t=this.constructor.controlSets[this.controls];t&&l.load(Object.values(t))}willUpdate(t){t.forEach((t,e)=>{const s=this[e];switch(e){case"pageSizes":void 0===s?this.pageSizes=[5,10,25,50,100]:this.itemsPerPage=r(this.itemsPerPage,this.pageSizes);break;case"itemsPerPage":void 0===s?this.itemsPerPage=this.pageSizes?.[0]||10:(this.itemsPerPage=r(this.itemsPerPage,this.pageSizes),void 0!==t&&(this.page=Math.ceil(((this.page-1)*t+1)/this.itemsPerPage)));break;case"totalItems":if(void 0===s)this.totalItems=0;else{const t=Math.max(1,Math.ceil(this.totalItems/this.itemsPerPage));this.page>t&&(this.page=t)}break;case"page":if(void 0===s)this.page=1;else{const t=i(this.page,1,this.totalPages);t!==this.page&&(this.page=t)}break;case"controls":void 0===s&&(this.controls="")}})}updated(t){super.updated(t);(t.has("page")&&void 0!==t.get("page")||t.has("itemsPerPage")&&void 0!==t.get("itemsPerPage"))&&this.dispatchEvent(new CustomEvent("page-change",{detail:{currentPage:this.page,totalPages:this.totalPages,itemsPerPage:this.itemsPerPage,totalItems:this.totalItems},bubbles:!0})),t.has("controls")&&this.controls&&"none"!==this.controls&&this.loadControls()}get totalPages(){return this.totalItems&&this.itemsPerPage?Math.ceil(this.totalItems/this.itemsPerPage):1}nextPage(){this.page=i(this.page+1,1,this.totalPages)}previousPage(){this.page=i(this.page-1,1,this.totalPages)}render(){const e=this.constructor.controlSets[this.controls];return t`
      <div id="controls" aria-label="Pagination">
        <div class="left">
          <slot>${e?.left??s}</slot>
        </div>
        <div class="right">
          <slot name="right">${e?.right??s}</slot>
        </div>
			</div>
    `}static styles=e`
    :host {
      display: block;
    }
    #controls {
      display: flex;
      align-items: center;
      gap: var(--spacer_q, 0.25rem);
      flex-wrap: wrap;
    }
    .left {
      display: flex;
      align-items: center;
      gap: var(--spacer_q, 0.25rem);
      flex-wrap: wrap;
    }
    .right {
      display: flex;
      align-items: center;
      gap: var(--spacer_q, 0.25rem);
      flex-wrap: wrap;
      margin-left: auto;
    }
  `;static controlSets={"":{left:null,right:null},none:{left:null,right:null},simple:{left:t`
        <kc-pg-prev></kc-pg-prev>
        <kc-pg-page-info></kc-pg-page-info>
        <kc-pg-next></kc-pg-next>
      `,right:null},full:{left:t`
        <kc-pg-first></kc-pg-first>
        <kc-pg-prev></kc-pg-prev>
        <kc-pg-goto-page></kc-pg-goto-page>
        <kc-pg-next></kc-pg-next>
        <kc-pg-last></kc-pg-last>
      `,right:t`<kc-pg-items-per-page></kc-pg-items-per-page>`}}}window.customElements.define("k-pagination",g);