import t from"./ButtonControl.js";import{html as e,render as l}from"../../lit-all.min.js";import"../Icon.js";import i from"../Dialog.js";const n={equals:"equals","not-equals":"does not equal",contains:"contains","not-contains":"does not contain","greater-than":"is greater than","greater-than-or-equal":"is greater than or equal to","less-than":"is less than","less-than-or-equal":"is less than or equal to"};export default class o extends t{connectedCallback(){super.connectedCallback(),this.hasAttribute("title")||(this.title="Filters")}handleFilter(){this.handleAction()}handleAction(){this.openDialog()}openDialog=()=>{const t=this.host;if(!t)return;const o=document.createElement("div");l(e`
      <div class="p">
        ${0===t.filters.length?e`<p>No Current Filters.</p>`:e`
          <h5>Current Filters</h5>
          <ul id="currentFilters">
            ${t.filters.map(({field:l,condition:i,value:o})=>e`
              <li data-field="${l}" data-condition="${i}" data-value="${o}">
                ${t.getFieldLabel(l)} ${n[i]} "${o}"
                <button class="remove-filter no-btn pq" @click=${()=>{t.removeFilter(l,i,o),s.close(),this.openDialog()}}>
                  <k-icon name="close"></k-icon>
                </button>
              </li>
            `)}
          </ul>
        `}
        <hr />
        <h5>Add A Filter</h5>
        <form id="addFilter" @submit=${e=>{e.preventDefault();const l=e.target;t.addFilter(l.filterField.value,l.filterCondition.value,l.filterValue.value),s.close(),this.openDialog()}}>
          <select id="filterField" class="mb">
            ${t.fields.map(({name:t,label:l})=>e`<option value="${t}">${l}</option>`)}
          </select>
          <select id="filterCondition" class="mb">
            ${Object.entries(n).map(([t,l])=>e`
              <option value="${t}" ?selected="${"contains"===t}">${l}</option>
            `)}
          </select>
          <input id="filterValue" type="text" class="mb" />
          <button type="submit" class="btn primary mb mr">Add Filter</button>
          ${0===t.filters.length?"":e`
            <button type="button" class="btn danger mb mr" @click=${()=>{t.removeAllFilters(),s.close()}}>Clear All Filters</button>
          `}
        </form>
      </div>
    `,o);const s=i.create(o,{width:"600px",title:"Filters"})};render(){return e`<slot><k-icon name="filter"></k-icon></slot>`}}customElements.define("kc-tc-filters",o);