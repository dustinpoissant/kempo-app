import{html as e,css as t,unsafeStatic as s,literal as i}from"../lit-all.min.js";import r from"./ShadowComponent.js";import{toTitleCase as o}from"../utils/string.js";import{boolExists as n}from"../utils/propConverters.js";const l=Symbol("selected"),a=Symbol("hidden"),d=Symbol("index"),c=Symbol("editing");export default class h extends r{static properties={enablePages:{type:Boolean,reflect:!0,converter:n,attribute:"enable-pages"},pageSize:{type:Number,reflect:!0,attribute:"page-size"},currentPage:{type:Number,reflect:!0,attribute:"current-page"},pageSizeOptions:{type:Array,attribute:"page-size-options"},enableSelection:{type:Boolean,reflect:!0,converter:n,attribute:"enable-selection"},enableSorting:{type:Boolean,reflect:!0,converter:n,attribute:"enable-sorting"},caseSensitiveFilters:{type:Boolean,reflect:!0,converter:n,attribute:"case-sensitive-filters"},requestEdit:{type:Boolean,reflect:!0,converter:n,attribute:"request-edit"},requestDelete:{type:Boolean,reflect:!0,converter:n,attribute:"request-delete"},placeholder:{type:String,reflect:!0},filteredPlaceholder:{type:String,reflect:!0,attribute:"filtered-placeholder"},fields:{type:Array},records:{type:Array},filters:{type:Array},sort:{type:Array},columnSizes:{type:Object},fetchPending:{type:Boolean}};constructor(e={}){super(),void 0===this.pageSize&&(this.pageSize=50),void 0===this.currentPage&&(this.currentPage=1),void 0===this.pageSizeOptions&&(this.pageSizeOptions=[10,25,50,100,500]),void 0===this.records&&(this.records=e.records||[]),void 0===this.fields&&(this.fields=e.fields||[]),void 0===this.filters&&(this.filters=e.filters||[]),void 0===this.sort&&(this.sort=[]),void 0===this.columnSizes&&(this.columnSizes={}),void 0===this.fetchPending&&(this.fetchPending=!1),void 0===this.requestEdit&&(this.requestEdit=!1),void 0===this.requestDelete&&(this.requestDelete=!1),void 0===this.placeholder&&(this.placeholder="No Records"),void 0===this.filteredPlaceholder&&(this.filteredPlaceholder="")}handleSelectAllChange=e=>{e.target.checked?this.selectAllOnPage():this.deselectAllOnPage()};handleFieldClick=e=>{const t=this.sort.find(t=>t.name===e),s=!t||!t.asc;this.sortBy(e,s)};handleRecordSelectionChange=(e,t)=>{e[l]=!!t.target.checked,this.requestUpdate(),this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0}))};connectedCallback(){super.connectedCallback(),this.hasAttribute("controlled")||this.setAttribute("controlled","")}firstUpdated(){this.setData({records:this.records,fields:this.fields,filters:this.filters})}childrenUpdated(){this.requestUpdate()}updated(e){if(super.updated(e),this.enableSelection){const e=this.shadowRoot.getElementById("select-all");e&&(e.checked=this.getDisplayedRecords().length>0&&this.allOnPageSelected())}}renderColgroupTemplate(){const t=[];return this.enableSelection&&t.push(e`<col style="width: 40px" />`),this.hasBeforeControls()&&t.push(e`<col style="width: ${this.columnSizes.beforeControls}px" />`),this.fields.forEach(({size:s,hidden:i})=>{i||t.push(s?e`<col style="width: ${s}px" />`:e`<col />`)}),this.hasAfterControls()&&t.push(e`<col style="width: ${this.columnSizes.afterControls}px" />`),t}getColumnCount(){let e=0;return this.enableSelection&&e++,this.hasBeforeControls()&&e++,this.fields.forEach(({hidden:t})=>{t||e++}),this.hasAfterControls()&&e++,e}renderFieldsTemplate(){const t=[];return this.enableSelection&&t.push(e`
        <th class="controls field-select">
          <input type="checkbox" id="select-all" @change=${this.handleSelectAllChange} />
        </th>
      `),this.hasBeforeControls()&&t.push(e`<th class="controls field-before-controls"></th>`),this.fields.forEach(({name:s,label:i,hidden:r})=>{if(r)return;const o=this.sort.find(e=>e.name===s),n=this.sort.length>0&&this.sort[this.sort.length-1].name===s,l=o?o.asc?"sort-asc":"sort-desc":"";t.push(e`
        <th
          class="${l}"
          style="${this.enableSorting?"cursor: pointer;":""}"
          @click=${this.enableSorting?()=>this.handleFieldClick(s):null}
        >
          ${i}
          ${n?e`<k-icon name="arrow" direction="${o.asc?"down":"up"}" class="icon-sort"></k-icon>`:""}
        </th>
      `)}),this.hasAfterControls()&&t.push(e`<th class="controls field-after-controls"></th>`),t}renderRecordsTemplate(){let t=this.getDisplayedRecords(),s=0,i=this.pageSize;if(this.enablePages&&(s=(this.currentPage-1)*this.pageSize,i=s+this.pageSize,t=t.slice(s,i)),0===t.length){const t=this.records.filter(e=>null!==e).length>0?this.filteredPlaceholder:this.placeholder;if(t)return[e`<tr class="placeholder"><td colspan="${this.getColumnCount()}">${t}</td></tr>`]}let r=null,o=0;const n=t.map((t,i)=>null!==t?this.renderRecordTemplate(t):(null===r&&(r=s+i),o++,e`<tr class="record fetching"><td class="cell" colspan="${this.getColumnCount()}">Loading...</td></tr>`));return null===r||this.fetchPending||setTimeout(()=>{this.fetchPending||this.dispatchEvent(new CustomEvent("fetchRecords",{detail:{start:r,count:o},bubbles:!0}))},0),n}renderRecordTemplate(t){const s=[];return this.enableSelection&&s.push(e`
        <td class="cell selection controls">
          <input
            type="checkbox"
            .checked=${t[l]}
            @change=${e=>this.handleRecordSelectionChange(t,e)}
          />
        </td>
      `),this.hasBeforeControls()&&s.push(this.renderBeforeControlsTemplate()),this.fields.forEach(({name:i,formatter:r,calculator:o,type:n,editor:l,hidden:a,editable:d})=>{if(a)return;let h=t[i]||"";s.push(e`
        <td class="cell" data-field=${i}>
          ${t[c]?this.renderEditingCell(t,i,h,o,l,n,d):this.renderDisplayCell(t,i,h,o,r)}
        </td>
      `)}),this.hasAfterControls()&&s.push(this.renderAfterControlsTemplate()),e`
      <tr class="record ${t[c]?"editing":""}" data-index=${t[d]}>
        ${s}
      </tr>
    `}renderEditingCell(t,s,i,r,o,n,l){if(!1===l)return this.renderDisplayCell(t,s,i,r,null);if(r)return e`<input disabled .value=${r(t,this)} />`;if(o){const t=o(i);return e`${t}`}switch(n||typeof i){case"number":return e`<input type="number" .value=${i} />`;case"date":return e`<input type="date" .value=${i} />`;case"boolean":return e`
            <select .value=${i}>
              <option value="true" ?selected=${i}>True</option>
              <option value="false" ?selected=${!i}>False</option>
            </select>
          `;default:return e`<input type="text" .value=${i} />`}}renderDisplayCell(e,t,s,i,r){return i?i(e,this):r?r(s):s}renderBeforeControlsTemplate(){const t=[];return this.querySelectorAll('[slot="before"]').forEach(e=>{const s=e.tagName.toLowerCase(),i=document.createElement(s);Array.from(e.attributes).forEach(e=>{"slot"!==e.name&&i.setAttribute(e.name,e.value)}),e.innerHTML&&(i.innerHTML=e.innerHTML),t.push(i)}),e`
      <td class="cell controls controls-before">
        <div>${t}</div>
      </td>
    `}renderAfterControlsTemplate(){const t=[];return this.querySelectorAll('[slot="after"]').forEach(e=>{const s=e.tagName.toLowerCase(),i=document.createElement(s);Array.from(e.attributes).forEach(e=>{"slot"!==e.name&&i.setAttribute(e.name,e.value)}),e.innerHTML&&(i.innerHTML=e.innerHTML),t.push(i)}),e`
      <td class="cell controls controls-after">
        <div>${t}</div>
      </td>
    `}hasBeforeControls(){return!!this.querySelector('[slot="before"]')}hasAfterControls(){return!!this.querySelector('[slot="after"]')}hasTopControls(){return!!this.querySelector('[slot="top"]')}hasBottomControls(){return!!this.querySelector(":scope > :not([slot])")}editRecord(e){e[c]=!0;const t=this.shadowRoot.querySelector(`.record[data-index="${e[d]}"]`);t&&(t.classList.add("editing"),t.setAttribute("editing","true"),t.querySelectorAll(".cell[data-field]").forEach(t=>{const s=t.dataset.field,i=this.fields.find(e=>e.name===s);if(i){if(!1===i.editable)return;const r=e[s]||"";if(t.innerHTML="",i.calculator){const s=document.createElement("input");s.disabled=!0,s.value=i.calculator(e,this),t.appendChild(s)}else if(i.editor)t.appendChild(i.editor(r));else{const e=i.type||typeof r,s=h.editors[e]||h.editors.string;t.appendChild(s(r))}}})),this.dispatchEvent(new CustomEvent("editingChange",{detail:{record:e,editing:!0},bubbles:!0}))}saveEditedRecord(e){const t=this.shadowRoot.querySelector(`.record[data-index="${e[d]}"]`),s={};t&&t.querySelectorAll(".cell[data-field]").forEach(e=>{const t=e.dataset.field,i=this.fields.find(e=>e.name===t);if(i&&!i.calculator){const i=e.querySelector("input, select");i&&(s[t]=i.value)}});const i=()=>{Object.assign(e,s),e[c]=!1,t&&(t.classList.remove("editing"),t.removeAttribute("editing"),t.querySelectorAll(".cell[data-field]").forEach(t=>{const s=t.dataset.field,i=this.fields.find(e=>e.name===s);if(i){const r=e[s]||"";i.calculator?t.textContent=i.calculator(e,this):i.formatter?t.innerHTML=i.formatter(r):t.textContent=r}})),this.dispatchEvent(new CustomEvent("editingChange",{detail:{record:e,editing:!1},bubbles:!0}))};if(Object.keys(s).some(t=>String(e[t]??"")!==s[t]))if(this.requestEdit){t?.classList.add("pending");const r=()=>{t?.classList.remove("pending"),i()},o=()=>{t?.classList.remove("pending")};this.dispatchEvent(new CustomEvent("requestSave",{detail:{record:e,newData:s,approve:r,reject:o},bubbles:!0}))}else i();else this.cancelEditedRecord(e)}cancelEditedRecord(e){e[c]=!1;const t=this.shadowRoot.querySelector(`.record[data-index="${e[d]}"]`);t&&(t.classList.remove("editing"),t.removeAttribute("editing"),t.querySelectorAll(".cell[data-field]").forEach(t=>{const s=t.dataset.field,i=this.fields.find(e=>e.name===s);if(i){const r=e[s]||"";i.calculator?t.textContent=i.calculator(e,this):i.formatter?t.innerHTML=i.formatter(r):t.textContent=r}})),this.dispatchEvent(new CustomEvent("editingChange",{detail:{record:e,editing:!1},bubbles:!0}))}recordIsEditing(e){return e[c]}getCurrentPage(){return this.currentPage}getTotalPages(){return Math.ceil(this.getDisplayedRecords().length/this.pageSize)}setPage(e){e<1||e>this.getTotalPages()||(this.currentPage=e,this.requestUpdate(),this.dispatchEvent(new CustomEvent("pageChange",{bubbles:!0})))}firstPage(){1!==this.currentPage&&this.setPage(1)}nextPage(){this.currentPage<this.getTotalPages()&&this.setPage(this.currentPage+1)}prevPage(){this.currentPage>1&&this.setPage(this.currentPage-1)}lastPage(){this.currentPage!==this.getTotalPages()&&this.setPage(this.getTotalPages())}setPageSize(e){this.pageSize=e,this.currentPage=1,this.requestUpdate(),this.dispatchEvent(new CustomEvent("pageSizeChange",{bubbles:!0}))}getPageSize(){return this.pageSize}getPageSizeOptions(){return this.pageSizeOptions}getFieldLabel(e){const t=this.fields.find(t=>t.name===e);return t?t.label:o(e)}setPageSizeOptions(e){this.pageSizeOptions=e,this.requestUpdate()}setData({records:e=!1,fields:t=!1,pageSize:s=!1,pageSizeOptions:i=!1,currentPage:r=!1,enableSelection:o}={}){let n=!1,u=this.getTotalPages(),p=this.currentPage;e&&(this.records=e.map(e=>({...e})),this.records.forEach((e,t)=>{e[d]=t,e[l]=!1,e[a]=!1,e[c]=!1}),this.fields=t||h.extractFieldsFromRecords(this.records),n=!0),s&&(this.pageSize=s,n=!0),i&&(this.pageSizeOptions=i),r&&(this.currentPage=r,n=!0),void 0!==o&&(this.enableSelection=o,n=!0),n&&this.requestUpdate();const g=this.getTotalPages();g!==u&&this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:this.getTotalPages()},bubbles:!0})),p>g&&this.setPage(g)}setRecords(e,t){let s=this.getTotalPages(),i=this.currentPage;this.records=e.map(e=>({...e})),this.records.forEach((e,t)=>{e[d]=t,e[l]=!1,e[a]=!1,e[c]=!1}),this.fields=t||h.extractFieldsFromRecords(this.records),this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordsSet",{detail:{records:e},bubbles:!0}));const r=this.getTotalPages();r!==s&&this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:this.getTotalPages()},bubbles:!0})),i>r&&this.setPage(r)}setupFetchRecords(e,t){const s=this.records.length,i=this.getTotalPages();if(s<e){this.records.length=e,this.records.fill(null,s),this.requestUpdate();const t=this.getTotalPages();t!==i&&setTimeout(()=>{this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:t},bubbles:!0}))},0)}this.addEventListener("fetchRecords",async e=>{if(this.fetchPending)return;this.fetchPending=!0;const{start:s,count:i}=e.detail,r=await t(s,i);r.forEach((e,t)=>{e[d]=s+t,void 0===e[l]&&(e[l]=!1),void 0===e[a]&&(e[a]=!1),void 0===e[c]&&(e[c]=!1)}),this.records.splice(s,r.length,...r),this.fetchPending=!1,this.requestUpdate()})}addRecord(e){e[l]=!1,e[a]=!1,e[d]=this.records.length,this.records.push(e),this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordAdded",{detail:{record:e},bubbles:!0}))}updateRecord(e,t){let s=!1,i=this.records.find(t=>t===e);if(i||void 0===e[d]||(i=this.records[e[d]]),Object.keys(t).forEach(e=>{i.hasOwnProperty(e)&&(i[e]=t[e],s=!0)}),s){const e=(this.currentPage-1)*this.pageSize,t=e+this.pageSize;(!this.enablePages||i[d]>=e&&i[d]<t)&&this.requestUpdate()}}deleteRecord(e){let t=this.records.find(t=>t===e);const s=this.getTotalPages();if(t||void 0===e[d]||(t=this.records[e[d]]),!t)return;const i=()=>{const e=this.records.indexOf(t);this.records.splice(e,1),this.records.forEach((e,t)=>{e[d]=t}),this.requestUpdate(),this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0})),this.dispatchEvent(new CustomEvent("recordDeleted",{detail:{index:e},bubbles:!0}));const i=this.getTotalPages();this.currentPage>i&&this.setPage(i),i!==s&&this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:i},bubbles:!0}))};if(this.requestDelete){const e=this.shadowRoot.querySelector(`.record[data-index="${t[d]}"]`);e?.classList.add("pending");const s=()=>{e?.classList.remove("pending"),i()},r=()=>{e?.classList.remove("pending")};this.dispatchEvent(new CustomEvent("requestDelete",{detail:{records:[t],approve:s,reject:r},bubbles:!0}))}else i()}deleteSelected(){const e=this.getTotalPages(),t=this.getSelectedRecords().map(e=>this.records.find(t=>t===e)??(void 0!==e[d]?this.records[e[d]]:null)).filter(Boolean);if(!t.length)return;const s=()=>{t.forEach(e=>{const t=this.records.indexOf(e);-1!==t&&this.records.splice(t,1)}),this.records.forEach((e,t)=>{e[d]=t}),this.requestUpdate();const s=this.getTotalPages();this.currentPage>s&&this.setPage(s),s!==e&&this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:s},bubbles:!0})),this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0}))};if(this.requestDelete){const e=t.map(e=>this.shadowRoot.querySelector(`.record[data-index="${e[d]}"]`)).filter(Boolean);e.forEach(e=>e.classList.add("pending"));const i=()=>{e.forEach(e=>e.classList.remove("pending")),s()},r=()=>{e.forEach(e=>e.classList.remove("pending"))};this.dispatchEvent(new CustomEvent("requestDelete",{detail:{records:t,approve:i,reject:r},bubbles:!0}))}else s()}getSelectedRecords(){return this.records.filter(e=>e[l])}selectAllOnPage(){const e=(this.currentPage-1)*this.pageSize,t=Math.min(e+this.pageSize,this.records.length);for(let s=e;s<t;s++)this.records[s][l]=!0;this.requestUpdate(),setTimeout(()=>{this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0}))},0)}deselectAllOnPage(){const e=(this.currentPage-1)*this.pageSize,t=Math.min(e+this.pageSize,this.records.length);for(let s=e;s<t;s++)this.records[s][l]=!1;this.requestUpdate(),setTimeout(()=>{this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0}))},0)}allOnPageSelected(){const e=(this.currentPage-1)*this.pageSize,t=Math.min(e+this.pageSize,this.records.length);for(let s=e;s<t;s++)if(!this.records[s][l])return!1;return!0}sortBy(e,t=!0){this.sort=this.sort.filter(t=>t.name!==e),this.sort.push({name:e,asc:t}),this.requestUpdate()}hideRecord(e){let t=this.records.find(t=>t===e);t||void 0===e[d]||(t=this.records[e[d]]),t&&(t[a]=!0,this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordHidden",{bubbles:!0})))}showRecord(e){let t=this.records.find(t=>t===e);t||void 0===e[d]||(t=this.records[e[d]]),t&&(t[a]=!1,this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordShown",{bubbles:!0})))}showAllRecords(){this.records.forEach(e=>{e[a]=!1}),this.filters.length&&(this.filters=[],this.dispatchEvent(new CustomEvent("filterRemoved",{bubbles:!0})),this.dispatchEvent(new CustomEvent("filterChange",{bubbles:!0}))),this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordShown",{bubbles:!0})),this.dispatchEvent(new CustomEvent("allRecordsShown",{bubbles:!0}))}addFilter(e,t,s){this.filters.push({field:e,condition:t,value:s}),this.dispatchEvent(new CustomEvent("filterAdded",{bubbles:!0})),this.dispatchEvent(new CustomEvent("filterChange",{bubbles:!0})),this.requestUpdate()}removeFilter(e,t,s,i=!0){const r=this.filters.findIndex(i=>i.field===e&&i.condition===t&&i.value===s);-1!==r&&(this.records.forEach(i=>{this.testFilter(i,e,t,s)||(i[a]=!1)}),this.filters.splice(r,1),this.dispatchEvent(new CustomEvent("filterRemoved",{bubbles:!0})),this.dispatchEvent(new CustomEvent("filterChange",{bubbles:!0})),i&&this.requestUpdate())}testFilter(e,t,s,i){let r=e[t],o=i;switch(this.caseSensitiveFilters||"string"!=typeof r||"string"!=typeof i||(r=r.toLowerCase(),o=i.toLowerCase()),s){case"equals":return r===o;case"not-equals":return r!==o;case"contains":return r.includes(o);case"not-contains":return!r.includes(o);case"greater-than":return r>o;case"less-than":return r<o;case"greater-than-or-equal":return r>=o;case"less-than-or-equal":return r<=o;default:return!0}}removeAllFilters(){this.filters.length&&([...this.filters].forEach(({field:e,condition:t,value:s})=>{this.removeFilter(e,t,s,!1)}),this.requestUpdate())}search(e){const t=e.trim().toLowerCase();let s=!1;this.records.forEach(e=>{if(e[a])return;let i=!1;this.fields.forEach(({name:s})=>{(e[s]?.toString().toLowerCase()||"").includes(t)&&(i=!0)}),e[a]!==!i&&(e[a]=!i,s=!0)}),s&&(this.dispatchEvent(new CustomEvent("recordHidden",{bubbles:!0})),this.requestUpdate()),this.dispatchEvent(new CustomEvent("search",{detail:{term:e},bubbles:!0}))}getDisplayedRecords(){this.filters.forEach(({field:e,condition:t,value:s})=>{this.records.forEach(i=>{null!==i&&(this.testFilter(i,e,t,s)||(i[a]=!0))})});let e=this.records.filter(e=>null===e||!e[a]);return this.sort.forEach(({name:t,asc:s})=>{e.sort((e,i)=>null===e||null===i?0:e[t]<i[t]?s?-1:1:e[t]>i[t]?s?1:-1:0)}),e}getHiddenRecords(){return this.records.filter(e=>e[a])}calculateColumnSizes(){const e=Array.from(this.querySelectorAll('[slot="before"]')),t=Array.from(this.querySelectorAll('[slot="after"]')),s={beforeControls:e.reduce((e,t)=>e+(t.maxWidth||40),0),afterControls:t.reduce((e,t)=>e+(t.maxWidth||40),0)},i=[...e,...t].some(e=>void 0===e.maxWidth);return JSON.stringify(this.columnSizes)!==JSON.stringify(s)&&(this.columnSizes=s),i&&setTimeout(()=>this.calculateColumnSizes(),0),this.columnSizes}setFieldHiddenState(e,t){const s=this.fields.find(t=>t.name===e);s&&(s.hidden=t,this.calculateColumnSizes(),this.requestUpdate(),this.dispatchEvent(new CustomEvent("fieldVisibilityChanged",{detail:{field:s},bubbles:!0})),this.dispatchEvent(new CustomEvent(t?"fieldHidden":"fieldShown",{detail:{field:s},bubbles:!0})))}hideField(e){this.setFieldHiddenState(e,!0)}showField(e){this.setFieldHiddenState(e,!1)}reorderFields(e){const t=[];e.forEach(e=>{const s=this.fields.find(t=>t.name===e);s&&t.push(s)}),this.fields=t,this.requestUpdate()}render(){return this.records&&this.fields?(this.calculateColumnSizes(),this.hasTopControls()?this.setAttribute("top-controls","true"):this.removeAttribute("top-controls"),this.hasBottomControls()?this.setAttribute("bottom-controls","true"):this.removeAttribute("bottom-controls"),e`
      <div id="wrapper">
        <div id="top"><slot name="top"></slot></div>
        <div id="table-container">
          <table>
            <colgroup>
              ${this.renderColgroupTemplate()}
            </colgroup>
            <thead>
              <tr>
                ${this.renderFieldsTemplate()}
              </tr>
            </thead>
            <tbody>
              ${this.renderRecordsTemplate()}
            </tbody>
          </table>
        </div>
        <div id="bottom"><slot></slot></div>
      </div>
      <div style="display: none">
        <slot name="before"></slot>
        <slot name="after"></slot>
      </div>
    `):e`
        <div id="wrapper">
          <div id="top"><slot name="top"></slot></div>
          <div id="table-container">
            <table><thead><tr></tr></thead><tbody></tbody></table>
          </div>
          <div id="bottom"><slot></slot></div>
        </div>
        <div style="display: none">
          <slot name="before"></slot>
          <slot name="after"></slot>
        </div>
      `}static styles=t`
    :host {
      display: block;
      margin-bottom: var(--spacer);
    }
    #wrapper {
      border: 1px solid var(--c_border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    #table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead tr {
      background-color: var(--c_bg__alt);
    }
    th, td {
      padding: calc(0.5 * var(--spacer)) var(--spacer);
      vertical-align: middle;
    }
    th:not(:last-child),
    td:not(:last-child) {
      border-right: 1px solid var(--c_border);
    }
    th:first-child,
    td:first-child {
      border-left: none;
    }
    th:last-child,
    td:last-child {
      border-right: none;
    }
    thead tr th {
      border-top: none;
      border-bottom: 1px solid var(--c_border);
    }
    tbody tr:not(:last-child) td {
      border-bottom: 1px solid var(--c_border);
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    tr.editing td.cell[data-field]:has(input),
    tr.editing td.cell[data-field]:has(select) {
      padding: 0;
    }
    tr.editing td.cell[data-field] input,
    tr.editing td.cell[data-field] select {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    tr.pending {
      pointer-events: none;
    }
    tr.pending td {
      position: relative;
      overflow: hidden;
    }
    tr.pending td::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(128, 128, 128, 0.15), transparent);
      transform: translateX(-100%);
      animation: row-pending 1.2s ease-in-out infinite;
    }
    @keyframes row-pending {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    th.controls,
    td.controls {
      padding: 0;
    }
    td.controls-after > div,
    td.controls-before > div {
      display: flex;
      align-items: center;
    }
    .field-select,
    .selection {
      width: 40px;
      text-align: center;
    }
    .field-select input,
    .selection input {
      width: 1.25rem;
      height: 1.25rem;
    }
    .icon-sort {
      float: right;
      opacity: 0.5;
    }
    #top, #bottom {
      display: flex;
      width: 100%;
    }
    #top slot {
      display: block;
      width: 100%;
      border-bottom: 1px solid var(--c_border);
    }
    #bottom slot {
      display: block;
      width: 100%;
      border-top: 1px solid var(--c_border);
    }
    :host(:not([top-controls])) #top,
    :host(:not([bottom-controls])) #bottom {
      display: none;
    }
    tr.placeholder td {
      text-align: center;
      color: var(--c_text__muted);
      font-style: italic;
      padding: var(--spacer);
    }
  `;static extractFieldsFromRecords(e,t=100){const s=new Set;return e.slice(0,t).forEach(e=>{Object.keys(e).forEach(e=>s.add(e))}),[...s].map(e=>({name:e,label:o(e)}))}static format(e){return(Array.isArray(e)?h.formatters.array:h.formatters[typeof e])(e)}static formatters={string:e=>e,number:e=>`${e}`,date:e=>e.toLocaleDateString(),boolean:e=>e?"True":"False",array:e=>e.map(e=>h.format(e)).join(", "),undefined:e=>"",null:e=>"<code>null</code>"};static editors={string:e=>{const t=document.createElement("input");return t.value=e,t},number:e=>{const t=document.createElement("input");return t.type="number",t.value=e,t},date:e=>{const t=document.createElement("input");return t.type="date",t.value=e,t},boolean:e=>{const t=document.createElement("select");return t.innerHTML=`\n        <option value="true" ${e?"selected":""}>True</option>\n        <option value="false" ${e?"":"selected"}>False</option>\n      `,t.value=e,t},calculated:e=>{const t=document.createElement("input");return t.disabled=!0,t.value=e,t}}}window.customElements.define("k-table",h);