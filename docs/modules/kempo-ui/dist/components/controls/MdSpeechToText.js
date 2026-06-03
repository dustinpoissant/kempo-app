import e from"./Control.js";import{html as t,css as s}from"../../lit-all.min.js";import"../SpeechToText.js";export default class o extends e{static requires=["replaceSelection"];static hostMode="write";static properties={...e.properties,language:{type:String,reflect:!0},continuous:{type:Boolean,reflect:!0}};constructor(){super(),this.language="en-US",this.continuous=!1}handleEnd=e=>{const t=(e.detail?.text||"").trim();t&&this.host?.replaceSelection?.(t+" ",{selectInserted:!1})};render(){return t`
      <k-speech-to-text
        language=${this.language}
        ?continuous=${this.continuous}
        @end=${this.handleEnd}
      ></k-speech-to-text>
    `}static styles=[e.styles,s`
      :host { margin: var(--spacer_q); }
      k-speech-to-text { --btn_size: 2rem; }
    `]}customElements.define("kc-md-speech-to-text",o);