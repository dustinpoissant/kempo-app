import t from"./ButtonControl.js";import{html as a,css as e}from"../../lit-all.min.js";import"../Icon.js";const o={p:"Paragraph",h1:"Heading 1",h2:"Heading 2",h3:"Heading 3",h4:"Heading 4",h5:"Heading 5",h6:"Heading 6",blockquote:"Blockquote",pre:"Code Block"},r={p:"format_paragraph",h1:"format_h1",h2:"format_h2",h3:"format_h3",h4:"format_h4",h5:"format_h5",h6:"format_h6",blockquote:"format_quote",pre:"code_blocks"};export default class s extends t{static requires=["formatBlock"];static hostMode=["visual","write"];static properties={...t.properties,tag:{type:String,reflect:!0}};constructor(){super(),this.tag="p"}connectedCallback(){super.connectedCallback(),this.hasAttribute("title")||(this.title=o[this.tag]||this.tag)}getDefaultLabel(t){return o[t||this.tag]||(t||this.tag).toUpperCase()}getDefaultIcon(t){return r[t||this.tag]||"format_paragraph"}handleAction(){this.host?.formatBlock?.(this.tag)}render(){const t=o[this.tag]||this.tag.toUpperCase(),e=r[this.tag]||"format_paragraph";return a`
      <slot name="icon"><k-icon name=${e}></k-icon></slot>
      <slot>${t}</slot>
    `}static styles=[...t.styles,e`
      :host {
        gap: 0.5rem;
      }
    `]}customElements.define("kc-format-block",s);