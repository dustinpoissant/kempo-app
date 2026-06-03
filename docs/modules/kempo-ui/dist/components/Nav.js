import{html as t,css as e}from"../lit-all.min.js";import i from"./ShadowComponent.js";export default class o extends i{static properties={fixed:{type:Boolean,reflect:!0}};constructor(){super(),this.fixed=!1}render(){return t`<nav><slot></slot></nav>`}static styles=e`
    :host {
      display: block;
    }
    :host([fixed]) {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
    }
    nav {
      display: flex;
      align-items: center;
      width: 100%;
    }
    ::slotted(a) {
      display: inline-block;
      padding: var(--spacer);
      text-decoration: none !important;
    }
    ::slotted(.link) {
      display: inline-block;
      padding: var(--spacer) !important;
      text-decoration: none !important;
    }
  `}customElements.define("k-nav",o);