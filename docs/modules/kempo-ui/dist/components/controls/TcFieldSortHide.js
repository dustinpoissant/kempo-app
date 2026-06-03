import e from"./ButtonControl.js";import{html as t,render as i}from"../../lit-all.min.js";import"../Icon.js";import l from"../Dialog.js";export default class o extends e{connectedCallback(){super.connectedCallback(),this.hasAttribute("title")||(this.title="Show / Hide / Order Fields")}openDialog(){this.handleAction()}handleAction(){import("../Sortable.js");const e=this.host;if(!e)return;const o=document.createElement("div");i(t`
      <div class="m">
        <k-sortable id="sorting" @sort=${t=>{const i=Array.from(t.target.querySelectorAll("k-sortable-item")).map(e=>e.getAttribute("data-field"));e.reorderFields(i)}}>
          ${e.fields.map(i=>t`
            <k-sortable-item data-field="${i.name}">
              <label class="field pb0">
                <input
                  class="field-visibility"
                  data-field="${i.name}"
                  type="checkbox"
                  .checked="${!i.hidden}"
                  @change="${t=>e.setFieldHiddenState(i.name,!t.target.checked)}"
                  style="height: 1.25rem; width: 1.25rem"
                />
                ${i.label}
              </label>
            </k-sortable-item>
          `)}
        </k-sortable>
      </div>
    `,o),l.create(o,{title:"Show / Hide / Order Fields",width:"400px",cancelText:"Close"})}render(){return t`<slot><k-icon name="table-visibility"></k-icon></slot>`}}customElements.define("kc-tc-field-sort-hide",o);