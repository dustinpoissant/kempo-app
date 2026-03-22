import{html,css}from"../lit-all.min.js";import ShadowComponent from"./ShadowComponent.js";export default class Nav extends ShadowComponent{static properties={fixed:{type:Boolean,reflect:!0}};constructor(){super(),this.fixed=!1}render(){return html`<nav><slot></slot></nav>`}static styles=css`
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
  `}customElements.define("k-nav",Nav);