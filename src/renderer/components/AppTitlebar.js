import { html, css } from "/modules/kempo-ui/dist/lit-all.min.js";
import ShadowComponent from "/modules/kempo-ui/dist/components/ShadowComponent.js";

class AppTitlebar extends ShadowComponent {
  static properties = {
    platform: { type: String },
    title: { type: String },
    isMaximized: { type: Boolean },
  };

  /*
    Lifecycle
  */

  constructor() {
    super();
    this.platform = "win";
    this.title = "";
    this.isMaximized = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.platform = await window.api.getPlatform();
    this.title = await window.api.getAppName();
    this.isMaximized = await window.api.window.isMaximized();
    window.api.window.onMaximizeChange(val => { this.isMaximized = val; });
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      height: 36px;
      flex-shrink: 0;
      font-size: 13px;
      user-select: none;
      -webkit-app-region: drag;
      position: relative;
      z-index: 9999;
    }
    ::slotted(.no-drag) {
      -webkit-app-region: no-drag;
    }
    ::slotted([slot="left"]) {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 var(--spacer_h);
      cursor: pointer;
      background: transparent;
      border: none;
      -webkit-app-region: no-drag;
    }
    #mac-spacer {
      width: 72px;
      flex-shrink: 0;
    }
    .spacer {
      flex: 1 1 0;
      min-width: 0;
    }
    #title {
      text-align: center;
      color: var(--tc);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #window-controls {
      display: flex;
      -webkit-app-region: no-drag;
      height: 100%;
    }
    .win-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 100%;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 11px;
      transition: background 0.15s;
      -webkit-app-region: no-drag;
    }
    .win-btn:hover {
      background: rgba(255,255,255,0.3)
    }
    .win-btn.close:hover {
      background: rgba(255,0,0,0.5)
    }
    .win-btn k-icon {
      font-size: 10px;
    }
  `;

  /*
    Render
  */

  render() {
    const isMac = this.platform === "mac";
    const controls = html`
      <div id="window-controls">
        <button class="win-btn no-btn" @click=${() => window.api.window.minimize()} aria-label="Minimize">
          <k-icon name="window-minimize"></k-icon>
        </button>
        <button class="win-btn no-btn" @click=${() => window.api.window.maximize()} aria-label="Maximize">
          <k-icon name="${this.isMaximized ? "window-restore" : "window-maximize"}"></k-icon>
        </button>
        <button class="win-btn no-btn close" @click=${() => window.api.window.close()} aria-label="Close">
          <k-icon name="window-close"></k-icon>
        </button>
      </div>
    `;
    return html`
      ${isMac ? html`<div id="mac-spacer"></div>` : ""}
      <slot name="left"></slot>
      <div class="spacer"></div>
      <slot><span id="title">${this.title}</span></slot>
      <div class="spacer"></div>
      <slot name="right"></slot>
      ${!isMac ? controls : ""}
    `;
  }
}

window.customElements.define("app-titlebar", AppTitlebar);

export default AppTitlebar;
