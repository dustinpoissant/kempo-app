import{html as e,css as t,nothing as s}from"../lit-all.min.js";import i from"./ShadowComponent.js";import a from"../utils/sanitizeHtml.js";import n from"../utils/renderMarkdown.js";import"./MarkdownEditor.js";import"./controls/Bold.js";import"./controls/Italic.js";import"./controls/InlineCode.js";import"./controls/MdLink.js";import"./controls/BulletList.js";import"./controls/NumberList.js";import"./controls/Quote.js";import"./Spinner.js";import"./Icon.js";const o=new Set(["sending","delivered","read","failed"]);export default class r extends i{static properties={enterNewline:{type:Boolean,reflect:!0,attribute:"enter-newline"},showStatus:{type:String,reflect:!0,attribute:"show-status"},placeholder:{type:String,reflect:!0},disabled:{type:Boolean,reflect:!0},messages:{state:!0}};constructor(){super(),this.enterNewline=!1,this.showStatus=null,this.placeholder="Type a message...",this.disabled=!1,this.messages=[]}updated(e){super.updated(e),e.has("messages")&&this.#e()}addMessage(e={}){const t="outgoing"===e.type?"outgoing":"incoming",s=e.id||("undefined"!=typeof crypto&&"function"==typeof crypto.randomUUID?crypto.randomUUID():`msg-${Date.now()}-${Math.random().toString(36).slice(2,10)}`),i={id:s,type:t,html:a(e.html||""),status:o.has(e.status)?e.status:"outgoing"===t?"delivered":"read",sender:e.sender||"",timestamp:e.timestamp instanceof Date?e.timestamp:new Date};return this.messages=[...this.messages,i],s}updateMessage(e,t={}){let s=!1;return this.messages=this.messages.map(i=>{if(i.id!==e)return i;s=!0;const n={...i};return void 0!==t.html&&(n.html=a(t.html)),void 0!==t.status&&o.has(t.status)&&(n.status=t.status),void 0!==t.sender&&(n.sender=t.sender),t.timestamp instanceof Date&&(n.timestamp=t.timestamp),n}),s}removeMessage(e){const t=this.messages.length;return this.messages=this.messages.filter(t=>t.id!==e),this.messages.length!==t}clear(){this.messages=[]}send(){if(this.disabled)return null;const e=this.shadowRoot?.querySelector("k-markdown-editor");if(!e)return null;const t=(e.value||"").trim();if(!t)return null;const s=a(n(t,{breaks:!0})),i=this.addMessage({type:"outgoing",html:s,status:this.#t?"sending":"delivered"});return e.clear(),this.dispatchEvent(new CustomEvent("send",{detail:{id:i,html:s,markdown:t},bubbles:!0})),i}handleSendClick=()=>this.send();handleEditorKeydown=e=>{if(this.disabled)return;if("Enter"!==e.key||e.ctrlKey||e.metaKey||e.altKey)return;(this.enterNewline?e.shiftKey:!e.shiftKey)&&(e.preventDefault(),this.send())};#e=()=>{this.updateComplete.then(()=>{const e=this.shadowRoot?.querySelector(".window");e&&(e.scrollTop=e.scrollHeight)})};get#s(){for(let e=this.messages.length-1;e>=0;e--)if("outgoing"===this.messages[e].type)return this.messages[e].id;return null}get#t(){return null!=this.showStatus&&"false"!==this.showStatus}get#i(){return"icons"===this.showStatus?"icons":"text"}#a(e,t){return!!this.#t&&("outgoing"===e.type&&("sending"===e.status||"failed"===e.status||e.id===t))}#n(e){return"icons"===this.#i?this.#o(e):this.#r(e)}#r(t){return"sending"===t?e`<span class="status sending"><k-spinner size="xs"></k-spinner> Sending&hellip;</span>`:"delivered"===t?e`<span class="status">Delivered</span>`:"read"===t?e`<span class="status">Read</span>`:"failed"===t?e`<span class="status failed"><k-icon name="error"></k-icon> Not Delivered</span>`:s}#o(t){return"sending"===t?e`<span class="status status-icon-only"><k-spinner size="xs" title="Sending"></k-spinner></span>`:"delivered"===t?e`<span class="status status-icon-only"><k-icon name="check" title="Delivered"></k-icon></span>`:"read"===t?e`<span class="status status-icon-only"><k-icon name="done_all" title="Read"></k-icon></span>`:"failed"===t?e`<span class="status status-icon-only failed"><k-icon name="error" title="Not Delivered"></k-icon></span>`:s}#d(t,i){const a=this.#a(t,i);return e`
      <div
        class="message ${t.type} ${t.status}"
        data-id=${t.id}
      >
        ${t.sender?e`<div class="sender">${t.sender}</div>`:s}
        <div class="bubble">
          <div class="content" .innerHTML=${t.html}></div>
        </div>
        ${a?this.#n(t.status):s}
      </div>
    `}render(){const t=this.#s;return e`
      <div class="window" role="log" aria-live="polite">
        ${this.messages.map(e=>this.#d(e,t))}
      </div>
      <div class="input-area">
        <k-markdown-editor
          class="editor"
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          @keydown=${this.handleEditorKeydown}
        >
          <div slot="controls-top" class="controls-top">
            <slot name="controls-top">
              <kc-bold></kc-bold>
              <kc-italic></kc-italic>
              <kc-inline-code></kc-inline-code>
              <kc-md-link></kc-md-link>
              <kc-bullet-list></kc-bullet-list>
              <kc-number-list></kc-number-list>
              <kc-quote></kc-quote>
            </slot>
          </div>
          <div slot="controls-bottom" class="controls-bottom">
            <slot name="controls-bottom"></slot>
            <button
              type="button"
              class="send-btn primary"
              ?disabled=${this.disabled}
              @click=${this.handleSendClick}
              aria-label="Send message"
              title="Send message"
            >
              <k-icon name="send"></k-icon>
            </button>
          </div>
        </k-markdown-editor>
      </div>
    `}static styles=t`
    :host {
      --window_min_height: 16rem;
      --window_max_height: 32rem;
      --chat_padding: 0.5rem;
      --chat_gap: 0.5rem;
      --message_radius: 1rem;
      --message_max_width: 75%;
      --bubble_padding: 0.5rem 0.75rem;
      --bubble_bg__incoming: var(--c_bg__alt);
      --bubble_bg__outgoing: var(--c_primary);
      --bubble_tc__outgoing: white;
      --send_btn_bg: var(--c_primary);
      --send_btn_tc: white;

      display: flex;
      flex-direction: column;
      border: 1px solid var(--c_border);
      border-radius: var(--radius);
      background: var(--c_bg);
      /* Note: NO overflow:hidden on the host — that would clip the input
         area's focus shadow. Each child clips its own content against the
         shared rounded corners instead. */
    }
    :host([disabled]) {
      opacity: 0.6;
    }
    .window {
      flex: 1 1 auto;
      min-height: var(--window_min_height);
      max-height: var(--window_max_height);
      overflow-y: auto;
      padding: var(--chat_padding);
      display: flex;
      flex-direction: column;
      gap: var(--chat_gap);
      scroll-behavior: smooth;
      /* Match the chat's outer rounded corners on the top edge so messages
         don't render past them. */
      border-top-left-radius: var(--radius);
      border-top-right-radius: var(--radius);
    }
    .message {
      display: flex;
      flex-direction: column;
      max-width: var(--message_max_width);
      gap: 0.125rem;
    }
    .message.outgoing {
      align-self: flex-end;
      align-items: flex-end;
    }
    .message.incoming {
      align-self: flex-start;
      align-items: flex-start;
    }
    .sender {
      font-size: 0.75rem;
      color: var(--tc_muted);
    }
    .bubble {
      padding: var(--bubble_padding);
      border-radius: var(--message_radius);
      background: var(--bubble_bg__incoming);
      color: var(--tc);
      word-wrap: break-word;
      overflow-wrap: anywhere;
    }
    .message.outgoing .bubble {
      background: var(--bubble_bg__outgoing);
      color: var(--bubble_tc__outgoing);
    }
    .message.outgoing.sending .bubble {
      opacity: 0.7;
    }
    .message.outgoing.failed .bubble {
      background: var(--c_danger, #d32f2f);
    }
    .content {
      line-height: 1.4;
    }
    .content p:first-child { margin-top: 0; }
    .content p:last-child { margin-bottom: 0; }
    /* iMessage-style small grey label below the message bubble. */
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.7rem;
      color: var(--tc_muted);
      margin-top: 0.125rem;
    }
    .status.failed {
      color: var(--c_danger, #d32f2f);
    }
    .status k-spinner,
    .status k-icon {
      font-size: 0.8rem;
    }
    .status-icon-only {
      font-size: 0.95rem;
    }
    .input-area {
      position: relative;
      border-top: 1px solid var(--c_border);
      border-bottom-left-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
    }
    .editor {
      /* Markdown editor fills the bottom of the chat. CSS custom properties
         pierce shadow boundaries -- '--height' sets the initial size of the
         editor's internal Resize wrapper. */
      --height: 13rem;
      display: block;
      width: 100%;
    }
    .controls-top,
    .controls-bottom {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.125rem;
    }
    .controls-bottom {
      width: 100%;
    }
    .send-btn {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      min-height: 2rem;
      padding: var(--spacer_q);
      border: 1px solid transparent;
      border-radius: 50%;
      background: var(--c_primary);
      color: white;
      cursor: pointer;
      transition: opacity var(--animation_ms);
    }
    .send-btn:hover:not(:disabled) {
      opacity: 0.9;
    }
    .send-btn:focus-visible {
      outline: none;
      box-shadow: var(--focus_shadow);
    }
    .send-btn:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `}customElements.define("k-chat",r);