import{html as t,css as e,nothing as i}from"../lit-all.min.js";import s from"./ShadowComponent.js";import l from"../utils/renderMarkdown.js";import o,{STRIP_COMPLETELY as n}from"../utils/sanitizeHtml.js";import a from"../utils/debounce.js";import r from"./controls/Control.js";import"./Resize.js";import"./Tabs.js";const c=Symbol(),h=Symbol(),d=Symbol(),u=Symbol();export default class b extends s{static formAssociated=!0;static properties={value:{type:String},name:{type:String,reflect:!0},placeholder:{type:String,reflect:!0},disabled:{type:Boolean,reflect:!0},required:{type:Boolean,reflect:!0},readonly:{type:Boolean,reflect:!0},mode:{type:String,reflect:!0},allowedTags:{type:String,reflect:!0,attribute:"allowed-tags"},disallowedTags:{type:String,reflect:!0,attribute:"disallowed-tags"},scriptsEnabled:{type:Boolean,reflect:!0,attribute:"scripts-enabled"},controls:{type:String,reflect:!0}};constructor(){super(),this.internals=this.attachInternals(),this.value="",this.name="",this.placeholder="",this.disabled=!1,this.required=!1,this.readonly=!1,this.mode="write",this.allowedTags="",this.disallowedTags="",this.scriptsEnabled=!1,this.controls="",this[c]="",this[h]=a(()=>this.handleChange(),300)}loadControls(){const t=this.constructor.controlSets[this.controls];t&&r.load(Object.values(t))}connectedCallback(){super.connectedCallback(),this.hasAttribute("controlled")||this.setAttribute("controlled",""),this.hasAttribute("value")&&(this[c]=this.getAttribute("value")),!this.value&&this[c]&&(this.value=this[c])}updated(t){super.updated(t),t.has("value")&&this.internals.setFormValue(this.value),t.has("controls")&&this.controls&&"none"!==this.controls&&this.loadControls(),this[u]()}formResetCallback(){this.value=this[c],this.mode="write"}formStateRestoreCallback(t){"string"==typeof t&&(this.value=t)}formDisabledCallback(t){this.disabled=t}focus(){"write"!==this.mode&&(this.mode="write"),this.updateComplete.then(()=>{this.shadowRoot?.querySelector("textarea")?.focus()})}blur(){this.shadowRoot?.querySelector("textarea")?.blur()}clear(){this.value=""}setMode(t){"write"!==t&&"preview"!==t||(this.mode=t)}togglePreview(){this.mode="write"===this.mode?"preview":"write"}get textarea(){return this.shadowRoot?.querySelector("textarea")||null}getSelection(){const t=this.textarea;return t?{start:t.selectionStart,end:t.selectionEnd,text:t.value.substring(t.selectionStart,t.selectionEnd)}:{start:0,end:0,text:""}}replaceSelection(t,{selectInserted:e=!0}={}){const i=this.textarea;i&&("write"!==this.mode&&(this.mode="write"),this.updateComplete.then(()=>{i.focus();const{selectionStart:s,selectionEnd:l}=i,o=i.value.substring(0,s),n=i.value.substring(l),a=o+t+n;i.value=a;const r=s+t.length;i.selectionStart=e?s:r,i.selectionEnd=r,this.value=a,i.dispatchEvent(new Event("input",{bubbles:!0}))}))}wrapSelection(t,e=t,i=""){const s=this.textarea;s?("write"!==this.mode&&(this.mode="write"),this.updateComplete.then(()=>{s.focus();const{selectionStart:l,selectionEnd:o,value:n}=s,a=n.substring(l,o);if(a.length>=t.length+e.length&&a.startsWith(t)&&a.endsWith(e)){const i=a.slice(t.length,a.length-e.length),r=n.substring(0,l)+i+n.substring(o);return s.value=r,s.selectionStart=l,s.selectionEnd=l+i.length,this.value=r,void s.dispatchEvent(new Event("input",{bubbles:!0}))}const r=n.substring(Math.max(0,l-t.length),l),c=n.substring(o,Math.min(n.length,o+e.length));if(r===t&&c===e){const i=n.substring(0,l-t.length)+a+n.substring(o+e.length);return s.value=i,s.selectionStart=l-t.length,s.selectionEnd=s.selectionStart+a.length,this.value=i,void s.dispatchEvent(new Event("input",{bubbles:!0}))}const h=a||i,d=n.substring(0,l)+t+h+e+n.substring(o);s.value=d;const u=l+t.length;s.selectionStart=u,s.selectionEnd=u+h.length,this.value=d,s.dispatchEvent(new Event("input",{bubbles:!0}))})):this.replaceSelection(t+i+e)}insertAtCursor(t){this.replaceSelection(t,{selectInserted:!1})}replaceInSelectedLines(t,e=""){const i=this.textarea;i&&("write"!==this.mode&&(this.mode="write"),this.updateComplete.then(()=>{i.focus();const{selectionStart:s,selectionEnd:l,value:o}=i,n=o.lastIndexOf("\n",s-1)+1,a=o.indexOf("\n",l),r=-1===a?o.length:a,c=o.substring(n,r),h=c.split("\n").map(i=>i.replace(t,e)).join("\n");if(h===c)return;const d=o.substring(0,n)+h+o.substring(r);i.value=d,i.selectionStart=n,i.selectionEnd=n+h.length,this.value=d,i.dispatchEvent(new Event("input",{bubbles:!0}))}))}insertLinePrefix(t,e=null){const i=this.textarea;i&&("write"!==this.mode&&(this.mode="write"),this.updateComplete.then(()=>{i.focus();const{selectionStart:s,selectionEnd:l,value:o}=i,n=o.lastIndexOf("\n",s-1)+1,a=o.indexOf("\n",l),r=-1===a?o.length:a,c=o.substring(n,r).split("\n"),h=c.filter(t=>t.length>0),d=h.length>0&&h.every(e=>e.startsWith(t)),u=c.map(i=>0===i.length?i:d?i.startsWith(t)?i.slice(t.length):i:i.startsWith(t)?i:e&&e.test(i)?i.replace(e,t):t+i).join("\n"),b=o.substring(0,n)+u+o.substring(r);i.value=b,i.selectionStart=n,i.selectionEnd=n+u.length,this.value=b,i.dispatchEvent(new Event("input",{bubbles:!0}))}))}bold(){return this.wrapSelection("**","**","bold text"),this}italic(){return this.wrapSelection("_","_","italic text"),this}strikethrough(){return this.wrapSelection("~~","~~","strikethrough"),this}inlineCode(){return this.getSelection().text.includes("\n")?this.wrapSelection("```\n","\n```","code"):this.wrapSelection("`","`","code"),this}quote(){return this.insertLinePrefix("> "),this}bulletList(){return this.insertLinePrefix("- "),this}numberList(){const t=this.textarea;return t?("write"!==this.mode&&(this.mode="write"),this.updateComplete.then(()=>{t.focus();const{selectionStart:e,selectionEnd:i,value:s}=t,l=s.lastIndexOf("\n",e-1)+1,o=s.indexOf("\n",i),n=-1===o?s.length:o,a=s.substring(l,n).split("\n"),r=/^\d+\. /,c=a.filter(t=>t.length>0);let h;if(c.length>0&&c.every(t=>r.test(t)))h=a.map(t=>t.replace(r,""));else{let t=1;h=a.map(e=>{if(!e)return e;const i=e.replace(r,"");return`${t++}. ${i}`})}const d=h.join("\n"),u=s.substring(0,l)+d+s.substring(n);t.value=u,t.selectionStart=l,t.selectionEnd=l+d.length,this.value=u,t.dispatchEvent(new Event("input",{bubbles:!0}))}),this):this}formatBlock(t){const e=(t||"").toLowerCase();if(/^h[1-6]$/.test(e)){const t=parseInt(e.slice(1),10);this.insertLinePrefix("#".repeat(t)+" ",/^#{1,6} /)}else"blockquote"===e?this.quote():"pre"===e&&this.wrapSelection("```\n","\n```","code");return this}get isEmpty(){return!(this.value||"").trim()}get renderedHtml(){const t={},e=this[d];if(e&&(t.allowedTags=e),this.scriptsEnabled){const e=new Set(n);e.delete("SCRIPT"),t.stripCompletely=e}return o(l(this.value||""),t)}get[d](){const t=(this.allowedTags||"").trim(),e=(this.disallowedTags||"").trim();if(t&&e&&console.warn("[k-markdown-editor] `allowed-tags` and `disallowed-tags` are mutually exclusive; using `allowed-tags`."),t)return"*"===t?{has:()=>!0}:new Set(t.split(",").map(t=>t.trim().toUpperCase()).filter(Boolean));if(e){const t=new Set(e.split(",").map(t=>t.trim().toUpperCase()).filter(Boolean));return{has:e=>!t.has(e)}}return null}[u]=()=>{const t=this.shadowRoot?.querySelector("textarea");this.required&&this.isEmpty?this.internals.setValidity({valueMissing:!0},"Please fill out this field.",t):this.internals.setValidity({})};handleInput=t=>{this.value=t.target.value,this.dispatchEvent(new CustomEvent("input",{detail:{value:this.value},bubbles:!0})),this[h]()};handleChange=()=>{this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0}))};handleTabChange=t=>{const e=t.detail?.tab;e&&e!==this.mode&&(this.mode=e,this.dispatchEvent(new CustomEvent("mode-changed",{detail:{mode:e},bubbles:!0})))};render(){const e=this.constructor.controlSets[this.controls]??this.constructor.controlSets[""];return t`
      <k-resize dimension="height" ?disabled=${this.disabled}>
        <div class="frame">
          <k-tabs fixed-height active=${this.mode} @tab=${this.handleTabChange}>
            <k-tab slot="tabs" for="write">Write</k-tab>
            <k-tab slot="tabs" for="preview">Preview</k-tab>
            <k-tab-spacer slot="tabs"></k-tab-spacer>
            <div slot="tabs" class="controls-top">
              <slot name="controls-top">${e.top??i}</slot>
            </div>
            <k-tab-content name="write">
              <textarea
                class="editor"
                .value=${this.value}
                placeholder=${this.placeholder}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                aria-label=${this.name||this.placeholder}
                @input=${this.handleInput}
                @blur=${this.handleChange}
                @change=${this.handleChange}
              ></textarea>
            </k-tab-content>
            <k-tab-content name="preview">
              <div
                class="preview"
                role="article"
                .innerHTML=${this.isEmpty?'<p class="preview-empty">Nothing to preview</p>':this.renderedHtml}
              ></div>
            </k-tab-content>
          </k-tabs>
          <div class="footer">
            <slot name="controls-bottom">${e.bottom??i}</slot>
          </div>
        </div>
      </k-resize>
    `}static styles=e`
    :host {
      --padding: 0.5rem 0.75rem;
      display: block;
    }
    :host([disabled]) {
      opacity: 0.6;
    }
    :host([disabled]) k-tabs {
      pointer-events: none;
    }
    /* readonly: textarea is read-only via the native attribute, but the
       toolbar buttons mutate value programmatically, bypassing it. Mute
       the controls-top wrapper and the footer so their buttons can't
       fire. The Write/Preview tabs themselves stay interactive. */
    :host([readonly]) .controls-top,
    :host([readonly]) .footer {
      pointer-events: none;
      opacity: 0.5;
    }
    .controls-top {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
    }
    k-resize {
      width: 100%;
      height: var(--height, 14rem);
      min-height: var(--min-height);
      max-height: var(--max-height);
      background: var(--c_bg);
    }
    .frame {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      min-height: 0;
      box-sizing: border-box;
    }
    k-tabs {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    k-tab-content[active] {
      display: flex;
      flex-direction: column;
      padding: var(--spacer_q);
    }
    k-tab-content:not([active]) {
      display: none;
    }
    .editor,
    .preview {
      box-sizing: border-box;
      flex: 1 1 0;
      min-height: 0;
      width: 100%;
      padding: var(--padding);
      background: transparent;
      color: var(--tc);
      font: inherit;
      line-height: 1.5;
      overflow-y: auto;
      scrollbar-width: thin;
      resize: none;
      max-height: none !important;
    }
    .preview-empty {
      color: var(--tc_muted);
      font-style: italic;
    }
    .footer {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      flex: 0 0 auto;
      border-top: 1px solid var(--c_border);
      box-sizing: border-box;
    }
    .footer:not(:has(::slotted(*))) {
      display: none;
    }
  `;static controlSets={"":{top:null,bottom:null},none:{top:null,bottom:null},minimal:{top:t`
        <kc-menu>
          <k-icon slot="icon" name="text_fields"></k-icon>
          <kc-format-block tag="h1"></kc-format-block>
          <kc-format-block tag="h3"></kc-format-block>
          <kc-format-block tag="h5"></kc-format-block>
        </kc-menu>
        <kc-bold></kc-bold>
        <kc-italic></kc-italic>
        <kc-bullet-list></kc-bullet-list>
        <kc-number-list></kc-number-list>
      `,bottom:null},normal:{top:t`
        <kc-menu>
          <k-icon slot="icon" name="text_fields"></k-icon>
          <kc-format-block tag="h1"></kc-format-block>
          <kc-format-block tag="h2"></kc-format-block>
          <kc-format-block tag="h3"></kc-format-block>
          <kc-format-block tag="h4"></kc-format-block>
          <kc-format-block tag="h5"></kc-format-block>
          <kc-format-block tag="h6"></kc-format-block>
        </kc-menu>
        <kc-bold></kc-bold>
        <kc-italic></kc-italic>
        <kc-quote></kc-quote>
        <kc-inline-code></kc-inline-code>
        <kc-md-link></kc-md-link>
        <kc-bullet-list></kc-bullet-list>
        <kc-number-list></kc-number-list>
      `,bottom:null},full:{top:t`
        <kc-menu>
          <k-icon slot="icon" name="text_fields"></k-icon>
          <kc-format-block tag="h1"></kc-format-block>
          <kc-format-block tag="h2"></kc-format-block>
          <kc-format-block tag="h3"></kc-format-block>
          <kc-format-block tag="h4"></kc-format-block>
          <kc-format-block tag="h5"></kc-format-block>
          <kc-format-block tag="h6"></kc-format-block>
        </kc-menu>
        <kc-bold></kc-bold>
        <kc-italic></kc-italic>
        <kc-strikethrough></kc-strikethrough>
        <kc-quote></kc-quote>
        <kc-inline-code></kc-inline-code>
        <kc-md-link></kc-md-link>
        <kc-md-image></kc-md-image>
        <kc-md-table></kc-md-table>
        <kc-bullet-list></kc-bullet-list>
        <kc-number-list></kc-number-list>
        <kc-md-speech-to-text></kc-md-speech-to-text>
      `,bottom:null}}}customElements.define("k-markdown-editor",b);