import t from"./Control.js";import{html as e,css as i}from"../../lit-all.min.js";import"../Icon.js";export default class n extends t{static hostEvents=["editingChange"];static properties={...t.properties,isEditing:{type:Boolean,state:!0}};constructor(){super(),this.isEditing=!1}get record(){const t=this.closest(".record");if(t){const e=t.dataset.index;if(void 0!==e)return this.host?.records?.[e]}return null}connectedCallback(){super.connectedCallback();const t=this.host;t&&t.addEventListener("editingChange",t=>{t.detail.record===this.record&&(this.isEditing=t.detail.editing)})}handleEdit=()=>{const t=this.record;t&&this.host?.editRecord(t)};handleSave=()=>{const t=this.record;t&&this.host?.saveEditedRecord(t)};handleCancel=()=>{const t=this.record;t&&this.host?.cancelEditedRecord(t)};render(){return this.isEditing?e`
      <button class="edit-btn save" @click=${this.handleSave}><k-icon name="check"></k-icon></button>
      <button class="edit-btn cancel" @click=${this.handleCancel}><k-icon name="close"></k-icon></button>
    `:e`
      <button class="edit-btn" @click=${this.handleEdit}><k-icon name="edit"></k-icon></button>
    `}static styles=[t.styles,i`
      :host { align-items: baseline; gap: 0.25rem; }
      .edit-btn { background: transparent; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: var(--radius); }
      .edit-btn:hover { background: oklch(from var(--c_bg__inv) l c h / 0.1); }
      .save { color: var(--c_success, green); }
      .cancel { color: var(--c_danger, red); }
    `]}customElements.define("kc-tc-edit",n);