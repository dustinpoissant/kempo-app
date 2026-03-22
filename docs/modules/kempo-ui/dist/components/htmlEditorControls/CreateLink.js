import HtmlEditorControl from"./HtmlEditorControl.js";import{html,css}from"../../lit-all.min.js";import"../Icon.js";import Dialog from"../Dialog.js";export default class CreateLink extends HtmlEditorControl{static properties={editorMode:{type:String,state:!0}};constructor(){super()}connectedCallback(){super.connectedCallback(),this.editor&&(this.editorMode=this.editor.mode,this.editor?.addEventListener("mode-changed",()=>{this.editor&&(this.editorMode=this.editor.mode)}))}handleMouseDown=t=>{if(!this.editor)return;t.preventDefault(),t.stopPropagation();const e=this.editor.selection?.text||"",o=document.createElement("input");o.type="text",o.placeholder="https://example.com",o.style.cssText="padding: 0.5rem; border: 1px solid var(--border-color, #ccc); border-radius: 4px; font-size: 1rem;";const i=document.createElement("input");i.type="text",i.placeholder="Enter link text",i.value=e,i.style.cssText="padding: 0.5rem; border: 1px solid var(--border-color, #ccc); border-radius: 4px; font-size: 1rem;";const n=document.createElement("div");n.className="p",n.style.cssText="display: flex; flex-direction: column; gap: 1rem;",n.innerHTML='\n\t\t\t<div style="display: flex; flex-direction: column; gap: 0.5rem;">\n\t\t\t\t<label style="font-weight: bold;">URL</label>\n\t\t\t</div>\n\t\t\t<div style="display: flex; flex-direction: column; gap: 0.5rem;">\n\t\t\t\t<label style="font-weight: bold;">Link Text</label>\n\t\t\t</div>\n\t\t',n.children[0].appendChild(o),n.children[1].appendChild(i),Dialog.create(n,{title:"Create Link",cancelText:"Cancel",confirmText:"Insert Link",confirmClasses:"success ml",confirmAction:t=>{const e=o.value.trim(),n=i.value.trim();if(!e)return void(t.keepDialogOpen=!0);const l=document.createElement("a");l.href=e,l.textContent=n||e,this.editor.selection?this.editor.replaceSelectionWithElement(l,!0):this.editor.insertElementAtCursor(l,!0)}})};render(){return this.hidden="code"===this.editorMode,html`
			<button
				class="${this.buttonClasses}"
				@mousedown="${this.handleMouseDown}"
			>
				<slot name="icon">
					<k-icon name="link"></k-icon>
				</slot>
				<slot></slot>
			</button>
		`}static styles=[HtmlEditorControl.styles,css`
			:host {
				display: inline-flex;
			}
		`]}customElements.define("k-hec-create-link",CreateLink);