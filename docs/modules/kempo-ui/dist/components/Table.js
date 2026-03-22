import{html,css,unsafeStatic,literal}from"../lit-all.min.js";import ShadowComponent from"./ShadowComponent.js";import{toTitleCase}from"../utils/string.js";import{boolExists}from"../utils/propConverters.js";const selected=Symbol("selected"),hidden=Symbol("hidden"),index=Symbol("index"),editing=Symbol("editing");export default class Table extends ShadowComponent{static properties={enablePages:{type:Boolean,reflect:!0,converter:boolExists,attribute:"enable-pages"},pageSize:{type:Number,reflect:!0,attribute:"page-size"},currentPage:{type:Number,reflect:!0,attribute:"current-page"},pageSizeOptions:{type:Array,attribute:"page-size-options"},enableSelection:{type:Boolean,reflect:!0,converter:boolExists,attribute:"enable-selection"},enableSorting:{type:Boolean,reflect:!0,converter:boolExists,attribute:"enable-sorting"},caseSensitiveFilters:{type:Boolean,reflect:!0,converter:boolExists,attribute:"case-sensitive-filters"},requestEdit:{type:Boolean,reflect:!0,converter:boolExists,attribute:"request-edit"},requestDelete:{type:Boolean,reflect:!0,converter:boolExists,attribute:"request-delete"},fields:{type:Array},records:{type:Array},filters:{type:Array},sort:{type:Array},columnSizes:{type:Object},fetchPending:{type:Boolean}};constructor(e={}){super(),void 0===this.pageSize&&(this.pageSize=50),void 0===this.currentPage&&(this.currentPage=1),void 0===this.pageSizeOptions&&(this.pageSizeOptions=[10,25,50,100,500]),void 0===this.records&&(this.records=e.records||[]),void 0===this.fields&&(this.fields=e.fields||[]),void 0===this.filters&&(this.filters=e.filters||[]),void 0===this.sort&&(this.sort=[]),void 0===this.columnSizes&&(this.columnSizes={}),void 0===this.fetchPending&&(this.fetchPending=!1),void 0===this.requestEdit&&(this.requestEdit=!1),void 0===this.requestDelete&&(this.requestDelete=!1)}handleSelectAllChange=e=>{e.target.checked?this.selectAllOnPage():this.deselectAllOnPage()};handleFieldClick=e=>{const t=this.sort.find(t=>t.name===e),s=!t||!t.asc;this.sortBy(e,s)};handleRecordSelectionChange=(e,t)=>{e[selected]=!!t.target.checked,this.requestUpdate(),this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0}))};firstUpdated(){this.setData({records:this.records,fields:this.fields,filters:this.filters})}childrenUpdated(){this.requestUpdate()}updated(e){if(super.updated(e),this.enableSelection){const e=this.shadowRoot.getElementById("select-all");e&&(e.checked=this.allOnPageSelected())}}renderColgroupTemplate(){const e=[];return this.enableSelection&&e.push(html`<col style="width: 40px" />`),this.hasBeforeControls()&&e.push(html`<col style="width: ${this.columnSizes.beforeControls}px" />`),this.fields.forEach(({size:t,hidden:s})=>{s||e.push(t?html`<col style="width: ${t}px" />`:html`<col />`)}),this.hasAfterControls()&&e.push(html`<col style="width: ${this.columnSizes.afterControls}px" />`),e}getColumnCount(){let e=0;return this.enableSelection&&e++,this.hasBeforeControls()&&e++,this.fields.forEach(({hidden:t})=>{t||e++}),this.hasAfterControls()&&e++,e}renderFieldsTemplate(){const e=[];return this.enableSelection&&e.push(html`
        <th class="controls field-select">
          <input type="checkbox" id="select-all" @change=${this.handleSelectAllChange} />
        </th>
      `),this.hasBeforeControls()&&e.push(html`<th class="controls field-before-controls"></th>`),this.fields.forEach(({name:t,label:s,hidden:i})=>{if(i)return;const r=this.sort.find(e=>e.name===t),o=this.sort.length>0&&this.sort[this.sort.length-1].name===t,n=r?r.asc?"sort-asc":"sort-desc":"";e.push(html`
        <th
          class="${n}"
          style="${this.enableSorting?"cursor: pointer;":""}"
          @click=${this.enableSorting?()=>this.handleFieldClick(t):null}
        >
          ${s}
          ${o?html`<k-icon name="arrow" direction="${r.asc?"down":"up"}" class="icon-sort"></k-icon>`:""}
        </th>
      `)}),this.hasAfterControls()&&e.push(html`<th class="controls field-after-controls"></th>`),e}renderRecordsTemplate(){let e=this.getDisplayedRecords(),t=0,s=this.pageSize;this.enablePages&&(t=(this.currentPage-1)*this.pageSize,s=t+this.pageSize,e=e.slice(t,s));let i=null,r=0;const o=e.map((e,s)=>null!==e?this.renderRecordTemplate(e):(null===i&&(i=t+s),r++,html`<tr class="record fetching"><td class="cell" colspan="${this.getColumnCount()}">Loading...</td></tr>`));return null===i||this.fetchPending||setTimeout(()=>{this.fetchPending||this.dispatchEvent(new CustomEvent("fetchRecords",{detail:{start:i,count:r},bubbles:!0}))},0),o}renderRecordTemplate(e){const t=[];return this.enableSelection&&t.push(html`
        <td class="cell selection controls">
          <input
            type="checkbox"
            .checked=${e[selected]}
            @change=${t=>this.handleRecordSelectionChange(e,t)}
          />
        </td>
      `),this.hasBeforeControls()&&t.push(this.renderBeforeControlsTemplate()),this.fields.forEach(({name:s,formatter:i,calculator:r,type:o,editor:n,hidden:l})=>{if(l)return;let a=e[s]||"";t.push(html`
        <td class="cell" data-field=${s}>
          ${e[editing]?this.renderEditingCell(e,s,a,r,n,o):this.renderDisplayCell(e,s,a,r,i)}
        </td>
      `)}),this.hasAfterControls()&&t.push(this.renderAfterControlsTemplate()),html`
      <tr class="record ${e[editing]?"editing":""}" data-index=${e[index]}>
        ${t}
      </tr>
    `}renderEditingCell(e,t,s,i,r,o){if(i)return html`<input disabled .value=${i(e,this)} />`;if(r){const e=r(s);return html`${e}`}switch(o||typeof s){case"number":return html`<input type="number" .value=${s} />`;case"date":return html`<input type="date" .value=${s} />`;case"boolean":return html`
            <select .value=${s}>
              <option value="true" ?selected=${s}>True</option>
              <option value="false" ?selected=${!s}>False</option>
            </select>
          `;default:return html`<input type="text" .value=${s} />`}}renderDisplayCell(e,t,s,i,r){return i?i(e,this):r?r(s):s}renderBeforeControlsTemplate(){const e=[];return this.querySelectorAll('[slot="before"]').forEach(t=>{const s=t.tagName.toLowerCase(),i=document.createElement(s);Array.from(t.attributes).forEach(e=>{"slot"!==e.name&&i.setAttribute(e.name,e.value)}),t.innerHTML&&(i.innerHTML=t.innerHTML),e.push(i)}),html`
      <td class="cell controls controls-before">
        <div>${e}</div>
      </td>
    `}renderAfterControlsTemplate(){const e=[];return this.querySelectorAll('[slot="after"]').forEach(t=>{const s=t.tagName.toLowerCase(),i=document.createElement(s);Array.from(t.attributes).forEach(e=>{"slot"!==e.name&&i.setAttribute(e.name,e.value)}),t.innerHTML&&(i.innerHTML=t.innerHTML),e.push(i)}),html`
      <td class="cell controls controls-after">
        <div>${e}</div>
      </td>
    `}hasBeforeControls(){return!!this.querySelector('[slot="before"]')}hasAfterControls(){return!!this.querySelector('[slot="after"]')}hasTopControls(){return!!this.querySelector('[slot="top"]')}hasBottomControls(){return!!this.querySelector(":scope > :not([slot])")}editRecord(e){e[editing]=!0;const t=this.shadowRoot.querySelector(`.record[data-index="${e[index]}"]`);t&&(t.classList.add("editing"),t.setAttribute("editing","true"),t.querySelectorAll(".cell[data-field]").forEach(t=>{const s=t.dataset.field,i=this.fields.find(e=>e.name===s);if(i){const r=e[s]||"";if(t.innerHTML="",i.calculator){const s=document.createElement("input");s.disabled=!0,s.value=i.calculator(e,this),t.appendChild(s)}else if(i.editor)t.appendChild(i.editor(r));else{const e=i.type||typeof r,s=Table.editors[e]||Table.editors.string;t.appendChild(s(r))}}})),this.dispatchEvent(new CustomEvent("editingChange",{detail:{record:e,editing:!0},bubbles:!0}))}saveEditedRecord(e){const t=this.shadowRoot.querySelector(`.record[data-index="${e[index]}"]`),s={};t&&t.querySelectorAll(".cell[data-field]").forEach(e=>{const t=e.dataset.field,i=this.fields.find(e=>e.name===t);if(i&&!i.calculator){const i=e.querySelector("input, select");i&&(s[t]=i.value)}});const i=()=>{Object.assign(e,s),e[editing]=!1,t&&(t.classList.remove("editing"),t.removeAttribute("editing"),t.querySelectorAll(".cell[data-field]").forEach(t=>{const s=t.dataset.field,i=this.fields.find(e=>e.name===s);if(i){const r=e[s]||"";i.calculator?t.textContent=i.calculator(e,this):i.formatter?t.innerHTML=i.formatter(r):t.textContent=r}})),this.dispatchEvent(new CustomEvent("editingChange",{detail:{record:e,editing:!1},bubbles:!0}))};if(Object.keys(s).some(t=>String(e[t]??"")!==s[t]))if(this.requestEdit){t?.classList.add("pending");const r=()=>{t?.classList.remove("pending"),i()},o=()=>{t?.classList.remove("pending")};this.dispatchEvent(new CustomEvent("requestSave",{detail:{record:e,newData:s,approve:r,reject:o},bubbles:!0}))}else i();else this.cancelEditedRecord(e)}cancelEditedRecord(e){e[editing]=!1;const t=this.shadowRoot.querySelector(`.record[data-index="${e[index]}"]`);t&&(t.classList.remove("editing"),t.removeAttribute("editing"),t.querySelectorAll(".cell[data-field]").forEach(t=>{const s=t.dataset.field,i=this.fields.find(e=>e.name===s);if(i){const r=e[s]||"";i.calculator?t.textContent=i.calculator(e,this):i.formatter?t.innerHTML=i.formatter(r):t.textContent=r}})),this.dispatchEvent(new CustomEvent("editingChange",{detail:{record:e,editing:!1},bubbles:!0}))}recordIsEditing(e){return e[editing]}getCurrentPage(){return this.currentPage}getTotalPages(){return Math.ceil(this.getDisplayedRecords().length/this.pageSize)}setPage(e){e<1||e>this.getTotalPages()||(this.currentPage=e,this.requestUpdate(),this.dispatchEvent(new CustomEvent("pageChange",{bubbles:!0})))}firstPage(){1!==this.currentPage&&this.setPage(1)}nextPage(){this.currentPage<this.getTotalPages()&&this.setPage(this.currentPage+1)}prevPage(){this.currentPage>1&&this.setPage(this.currentPage-1)}lastPage(){this.currentPage!==this.getTotalPages()&&this.setPage(this.getTotalPages())}setPageSize(e){this.pageSize=e,this.currentPage=1,this.requestUpdate(),this.dispatchEvent(new CustomEvent("pageSizeChange",{bubbles:!0}))}getPageSize(){return this.pageSize}getPageSizeOptions(){return this.pageSizeOptions}getFieldLabel(e){const t=this.fields.find(t=>t.name===e);return t?t.label:toTitleCase(e)}setPageSizeOptions(e){this.pageSizeOptions=e,this.requestUpdate()}setData({records:e=!1,fields:t=!1,pageSize:s=!1,pageSizeOptions:i=!1,currentPage:r=!1,enableSelection:o}={}){let n=!1,l=this.getTotalPages(),a=this.currentPage;e&&(this.records=e.map(e=>({...e})),this.records.forEach((e,t)=>{e[index]=t,e[selected]=!1,e[hidden]=!1,e[editing]=!1}),this.fields=t||Table.extractFieldsFromRecords(this.records),n=!0),s&&(this.pageSize=s,n=!0),i&&(this.pageSizeOptions=i),r&&(this.currentPage=r,n=!0),void 0!==o&&(this.enableSelection=o,n=!0),n&&this.requestUpdate();const d=this.getTotalPages();d!==l&&this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:this.getTotalPages()},bubbles:!0})),a>d&&this.setPage(d)}setRecords(e,t){let s=this.getTotalPages(),i=this.currentPage;this.records=e.map(e=>({...e})),this.records.forEach((e,t)=>{e[index]=t,e[selected]=!1,e[hidden]=!1,e[editing]=!1}),this.fields=t||Table.extractFieldsFromRecords(this.records),this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordsSet",{detail:{records:e},bubbles:!0}));const r=this.getTotalPages();r!==s&&this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:this.getTotalPages()},bubbles:!0})),i>r&&this.setPage(r)}setupFetchRecords(e,t){const s=this.records.length,i=this.getTotalPages();if(s<e){this.records.length=e,this.records.fill(null,s),this.requestUpdate();const t=this.getTotalPages();t!==i&&setTimeout(()=>{this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:t},bubbles:!0}))},0)}this.addEventListener("fetchRecords",async e=>{if(this.fetchPending)return;this.fetchPending=!0;const{start:s,count:i}=e.detail,r=await t(s,i);r.forEach((e,t)=>{e[index]=s+t,void 0===e[selected]&&(e[selected]=!1),void 0===e[hidden]&&(e[hidden]=!1),void 0===e[editing]&&(e[editing]=!1)}),this.records.splice(s,r.length,...r),this.fetchPending=!1,this.requestUpdate()})}addRecord(e){e[selected]=!1,e[hidden]=!1,e[index]=this.records.length,this.records.push(e),this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordAdded",{detail:{record:e},bubbles:!0}))}updateRecord(e,t){let s=!1,i=this.records.find(t=>t===e);if(i||void 0===e[index]||(i=this.records[e[index]]),Object.keys(t).forEach(e=>{i.hasOwnProperty(e)&&(i[e]=t[e],s=!0)}),s){const e=(this.currentPage-1)*this.pageSize,t=e+this.pageSize;(!this.enablePages||i[index]>=e&&i[index]<t)&&this.requestUpdate()}}deleteRecord(e){let t=this.records.find(t=>t===e);const s=this.getTotalPages();if(t||void 0===e[index]||(t=this.records[e[index]]),!t)return;const i=()=>{const e=this.records.indexOf(t);this.records.splice(e,1),this.records.forEach((e,t)=>{e[index]=t}),this.requestUpdate(),this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0})),this.dispatchEvent(new CustomEvent("recordDeleted",{detail:{index:e},bubbles:!0}));const i=this.getTotalPages();this.currentPage>i&&this.setPage(i),i!==s&&this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:i},bubbles:!0}))};if(this.requestDelete){const e=this.shadowRoot.querySelector(`.record[data-index="${t[index]}"]`);e?.classList.add("pending");const s=()=>{e?.classList.remove("pending"),i()},r=()=>{e?.classList.remove("pending")};this.dispatchEvent(new CustomEvent("requestDelete",{detail:{records:[t],approve:s,reject:r},bubbles:!0}))}else i()}deleteSelected(){const e=this.getTotalPages(),t=this.getSelectedRecords().map(e=>this.records.find(t=>t===e)??(void 0!==e[index]?this.records[e[index]]:null)).filter(Boolean);if(!t.length)return;const s=()=>{t.forEach(e=>{const t=this.records.indexOf(e);-1!==t&&this.records.splice(t,1)}),this.records.forEach((e,t)=>{e[index]=t}),this.requestUpdate();const s=this.getTotalPages();this.currentPage>s&&this.setPage(s),s!==e&&this.dispatchEvent(new CustomEvent("pageCountChanged",{detail:{totalPages:s},bubbles:!0})),this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0}))};if(this.requestDelete){const e=t.map(e=>this.shadowRoot.querySelector(`.record[data-index="${e[index]}"]`)).filter(Boolean);e.forEach(e=>e.classList.add("pending"));const i=()=>{e.forEach(e=>e.classList.remove("pending")),s()},r=()=>{e.forEach(e=>e.classList.remove("pending"))};this.dispatchEvent(new CustomEvent("requestDelete",{detail:{records:t,approve:i,reject:r},bubbles:!0}))}else s()}getSelectedRecords(){return this.records.filter(e=>e[selected])}selectAllOnPage(){const e=(this.currentPage-1)*this.pageSize,t=Math.min(e+this.pageSize,this.records.length);for(let s=e;s<t;s++)this.records[s][selected]=!0;this.requestUpdate(),setTimeout(()=>{this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0}))},0)}deselectAllOnPage(){const e=(this.currentPage-1)*this.pageSize,t=Math.min(e+this.pageSize,this.records.length);for(let s=e;s<t;s++)this.records[s][selected]=!1;this.requestUpdate(),setTimeout(()=>{this.dispatchEvent(new CustomEvent("selectionChange",{bubbles:!0}))},0)}allOnPageSelected(){const e=(this.currentPage-1)*this.pageSize,t=Math.min(e+this.pageSize,this.records.length);for(let s=e;s<t;s++)if(!this.records[s][selected])return!1;return!0}sortBy(e,t=!0){this.sort=this.sort.filter(t=>t.name!==e),this.sort.push({name:e,asc:t}),this.requestUpdate()}hideRecord(e){let t=this.records.find(t=>t===e);t||void 0===e[index]||(t=this.records[e[index]]),t&&(t[hidden]=!0,this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordHidden",{bubbles:!0})))}showRecord(e){let t=this.records.find(t=>t===e);t||void 0===e[index]||(t=this.records[e[index]]),t&&(t[hidden]=!1,this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordShown",{bubbles:!0})))}showAllRecords(){this.records.forEach(e=>{e[hidden]=!1}),this.filters.length&&(this.filters=[],this.dispatchEvent(new CustomEvent("filterRemoved",{bubbles:!0})),this.dispatchEvent(new CustomEvent("filterChange",{bubbles:!0}))),this.requestUpdate(),this.dispatchEvent(new CustomEvent("recordShown",{bubbles:!0})),this.dispatchEvent(new CustomEvent("allRecordsShown",{bubbles:!0}))}addFilter(e,t,s){this.filters.push({field:e,condition:t,value:s}),this.dispatchEvent(new CustomEvent("filterAdded",{bubbles:!0})),this.dispatchEvent(new CustomEvent("filterChange",{bubbles:!0})),this.requestUpdate()}removeFilter(e,t,s,i=!0){const r=this.filters.findIndex(i=>i.field===e&&i.condition===t&&i.value===s);-1!==r&&(this.records.forEach(i=>{this.testFilter(i,e,t,s)||(i[hidden]=!1)}),this.filters.splice(r,1),this.dispatchEvent(new CustomEvent("filterRemoved",{bubbles:!0})),this.dispatchEvent(new CustomEvent("filterChange",{bubbles:!0})),i&&this.requestUpdate())}testFilter(e,t,s,i){let r=e[t],o=i;switch(this.caseSensitiveFilters||"string"!=typeof r||"string"!=typeof i||(r=r.toLowerCase(),o=i.toLowerCase()),s){case"equals":return r===o;case"not-equals":return r!==o;case"contains":return r.includes(o);case"not-contains":return!r.includes(o);case"greater-than":return r>o;case"less-than":return r<o;case"greater-than-or-equal":return r>=o;case"less-than-or-equal":return r<=o;default:return!0}}removeAllFilters(){this.filters.length&&([...this.filters].forEach(({field:e,condition:t,value:s})=>{this.removeFilter(e,t,s,!1)}),this.requestUpdate())}search(e){const t=e.trim().toLowerCase();let s=!1;this.records.forEach(e=>{if(e[hidden])return;let i=!1;this.fields.forEach(({name:s})=>{(e[s]?.toString().toLowerCase()||"").includes(t)&&(i=!0)}),e[hidden]!==!i&&(e[hidden]=!i,s=!0)}),s&&(this.dispatchEvent(new CustomEvent("recordHidden",{bubbles:!0})),this.requestUpdate()),this.dispatchEvent(new CustomEvent("search",{detail:{term:e},bubbles:!0}))}getDisplayedRecords(){this.filters.forEach(({field:e,condition:t,value:s})=>{this.records.forEach(i=>{null!==i&&(this.testFilter(i,e,t,s)||(i[hidden]=!0))})});let e=this.records.filter(e=>null===e||!e[hidden]);return this.sort.forEach(({name:t,asc:s})=>{e.sort((e,i)=>null===e||null===i?0:e[t]<i[t]?s?-1:1:e[t]>i[t]?s?1:-1:0)}),e}getHiddenRecords(){return this.records.filter(e=>e[hidden])}calculateColumnSizes(){const e=Array.from(this.querySelectorAll('[slot="before"]')),t=Array.from(this.querySelectorAll('[slot="after"]')),s={beforeControls:e.reduce((e,t)=>e+(t.maxWidth||40),0),afterControls:t.reduce((e,t)=>e+(t.maxWidth||40),0)},i=[...e,...t].some(e=>void 0===e.maxWidth);return JSON.stringify(this.columnSizes)!==JSON.stringify(s)&&(this.columnSizes=s),i&&setTimeout(()=>this.calculateColumnSizes(),0),this.columnSizes}setFieldHiddenState(e,t){const s=this.fields.find(t=>t.name===e);s&&(s.hidden=t,this.calculateColumnSizes(),this.requestUpdate(),this.dispatchEvent(new CustomEvent("fieldVisibilityChanged",{detail:{field:s},bubbles:!0})),this.dispatchEvent(new CustomEvent(t?"fieldHidden":"fieldShown",{detail:{field:s},bubbles:!0})))}hideField(e){this.setFieldHiddenState(e,!0)}showField(e){this.setFieldHiddenState(e,!1)}reorderFields(e){const t=[];e.forEach(e=>{const s=this.fields.find(t=>t.name===e);s&&t.push(s)}),this.fields=t,this.requestUpdate()}render(){return this.records&&this.fields?(this.calculateColumnSizes(),this.hasTopControls()?this.setAttribute("top-controls","true"):this.removeAttribute("top-controls"),this.hasBottomControls()?this.setAttribute("bottom-controls","true"):this.removeAttribute("bottom-controls"),html`
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
    `):html`
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
      `}static styles=css`
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
    tr.editing td.cell[data-field] {
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
  `;static extractFieldsFromRecords(e,t=100){const s=new Set;return e.slice(0,t).forEach(e=>{Object.keys(e).forEach(e=>s.add(e))}),[...s].map(e=>({name:e,label:toTitleCase(e)}))}static format(e){return(Array.isArray(e)?Table.formatters.array:Table.formatters[typeof e])(e)}static formatters={string:e=>e,number:e=>`${e}`,date:e=>e.toLocaleDateString(),boolean:e=>e?"True":"False",array:e=>e.map(e=>Table.format(e)).join(", "),undefined:e=>"",null:e=>"<code>null</code>"};static editors={string:e=>{const t=document.createElement("input");return t.value=e,t},number:e=>{const t=document.createElement("input");return t.type="number",t.value=e,t},date:e=>{const t=document.createElement("input");return t.type="date",t.value=e,t},boolean:e=>{const t=document.createElement("select");return t.innerHTML=`\n        <option value="true" ${e?"selected":""}>True</option>\n        <option value="false" ${e?"":"selected"}>False</option>\n      `,t.value=e,t},calculated:e=>{const t=document.createElement("input");return t.disabled=!0,t.value=e,t}}}window.customElements.define("k-table",Table);