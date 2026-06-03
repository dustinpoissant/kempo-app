import e from"./Control.js";import{html as o,css as s}from"../../lit-all.min.js";import"./FontSizeIncrease.js";import"./FontSizeDecrease.js";import"../ControlGroup.js";export default class t extends e{static hostMode="code";static styles=[e.styles,s`
      :host { gap: 0; }
    `];render(){return o`
      <k-control-group class="b r mq">
        <kc-font-size-decrease></kc-font-size-decrease>
        <kc-font-size-increase></kc-font-size-increase>
      </k-control-group>
    `}}customElements.define("kc-font-size",t);