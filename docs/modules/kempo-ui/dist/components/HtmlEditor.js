import{html as t,css as e}from"../lit-all.min.js";import i from"./ShadowComponent.js";import o from"../utils/formatCode.js";import l from"../utils/debounce.js";import{getCalculatedTheme as r,subscribeToTheme as s}from"../utils/theme.js";import a from"./Dialog.js";import n from"./controls/Control.js";export default class c extends i{static formAssociated=!0;static properties={name:{type:String,reflect:!0},value:{type:String,reflect:!0},selection:{type:Object,state:!0},mode:{type:String,reflect:!0},controls:{type:String,reflect:!0},lexicalSrc:{type:String,attribute:"lexical-src"},monacoSrc:{type:String,attribute:"monaco-src"},nodes:{type:String},hasTopToolbar:{type:Boolean,state:!0},hasBottomToolbar:{type:Boolean,state:!0},fullscreen:{type:Boolean,reflect:!0},disabled:{type:Boolean,reflect:!0},readonly:{type:Boolean,reflect:!0},required:{type:Boolean,reflect:!0}};constructor(){super(),this.internals=this.attachInternals(),this.name="",this.value="",this.selection=null,this.cursor=null,this.mode="visual",this.controls="",this.lexicalSrc="",this.monacoSrc="",this.nodes="",this.hasTopToolbar=!1,this.hasBottomToolbar=!1,this.skipValueSync=!1,this.lexicalValueSync=!1,this.savedSelection=null,this.lexicalEditor=null,this.monacoEditor=null,this.editorTheme="auto",this.wordWrap=!0,this.minimapEnabled=!1,this.fontSize=14,this.fullscreen=!1,this.disabled=!1,this.readonly=!1,this.required=!1,this.lx={},this.debouncedSyncValue=l(()=>this.syncValueFromLexical(),300)}connectedCallback(){super.connectedCallback(),this.hasAttribute("controlled")||this.setAttribute("controlled",""),this.hasAttribute("value")&&(this.value=this.getAttribute("value")),this.slotObserver=new MutationObserver(()=>this.updateToolbarVisibility()),this.slotObserver.observe(this,{childList:!0,subtree:!0}),this.updateToolbarVisibility()}disconnectedCallback(){super.disconnectedCallback(),this.slotObserver?.disconnect(),this.cleanupFns?.forEach(t=>t?.()),this.monacoEditor?.dispose(),this.unsubscribeTheme?.(),this.fullscreen&&this.exitFullscreen()}updateToolbarVisibility(){const t=new Set(Array.from(this.children).map(t=>t.getAttribute("slot"))),e=this.constructor.controlSets[this.controls]??null;this.hasTopToolbar=!(!e?.topLeft&&!e?.topRight)||["toolbar-top","toolbar-top-left","toolbar-top-right"].some(e=>t.has(e)),this.hasBottomToolbar=!(!e?.bottomLeft&&!e?.bottomRight)||["toolbar-bottom","toolbar-bottom-left","toolbar-bottom-right"].some(e=>t.has(e))}updated(t){if(super.updated(t),t.has("controls")&&(this.updateToolbarVisibility(),this.controls&&"none"!==this.controls&&this.loadControls()),t.has("value")&&!this.skipValueSync&&(this.lexicalValueSync?this.lexicalValueSync=!1:this.lexicalEditor&&"visual"===this.mode&&!this.isVisualCompatible(this.value)?(this.skipLexicalExport=!0,this.mode="code"):this.syncContentToEditors(),this.updateFormValue(),this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0}))),t.has("mode")){const e=window.scrollY;this.handleModeSwitch(t.get("mode")),this.dispatchEvent(new CustomEvent("mode-changed",{detail:{mode:this.mode},bubbles:!0})),requestAnimationFrame(()=>window.scrollTo(0,e))}if(t.has("fullscreen")&&requestAnimationFrame(()=>this.monacoEditor?.layout()),t.has("disabled")||t.has("readonly")){const t=this.disabled||this.readonly;this.lexicalEditor?.setEditable(!t),this.monacoEditor?.updateOptions({readOnly:t})}(t.has("value")||t.has("required")||t.has("disabled"))&&this.#t()}#t=()=>{if(this.disabled)return void this.internals.setValidity({});const t=!(this.value||"").replace(/<[^>]+>/g,"").trim();this.required&&t?this.internals.setValidity({valueMissing:!0},"Please fill out this field.",this.lexicalContainer||this):this.internals.setValidity({})};async firstUpdated(){this.lexicalContainer=this.shadowRoot.querySelector(".lexical-editor"),this.monacoContainer=this.shadowRoot.querySelector(".monaco-editor-container"),await this.initLexical(),this.dispatchEvent(new CustomEvent("ready",{detail:{value:this.value},bubbles:!0}))}loadControls(){const t=this.constructor.controlSets[this.controls];t&&n.load(Object.values(t))}async loadNodeModules(){if(!this.nodes?.trim())return[];const t=new URL("./htmlEditorNodes/",import.meta.url).href;return(await Promise.all(this.nodes.split(",").map(t=>t.trim()).filter(Boolean).map(e=>import(`${t}${e}.js`)))).map(t=>t.default?.lexicalNode).filter(Boolean)}async loadLexicalModules(){const t=this.lexicalSrc||window.kempo?.lexicalUrl||"https://esm.sh",e=e=>((t,e)=>`${t}/${e}@0.43.0`)(t,e),[i,o,l,r,s,a,n,c,d]=await Promise.all([import(e("lexical")),import(e("@lexical/rich-text")),import(e("@lexical/html")),import(e("@lexical/history")),import(e("@lexical/list")),import(e("@lexical/link")),import(e("@lexical/selection")),import(e("@lexical/table")),import(e("@lexical/code"))]);this.lx={lexical:i,richText:o,lexicalHtml:l,history:r,list:s,link:a,selection:n,table:c,code:d},this.StyledTextNode=class extends i.TextNode{static getType(){return"styled-text"}static clone(t){return new this(t.__text,t.__key)}static importDOM(){return{span:()=>({conversion:t=>{const e=t.getAttribute("style");if(!e)return null;const o=i.$createTextNode(t.textContent);return o.setStyle(e),{node:o}},priority:1})}}static importJSON(t){return i.$createTextNode(t.text)}exportJSON(){return{...super.exportJSON(),type:"styled-text"}}},this.ImageNode=class extends i.DecoratorNode{static getType(){return"image"}static clone(t){return new this(t.__src,t.__alt,t.__key)}static importDOM(){return{img:()=>({conversion:t=>({node:new this(t.getAttribute("src")||"",t.getAttribute("alt")||"")}),priority:1})}}static importJSON(t){return new this(t.src||"",t.alt||"")}constructor(t="",e="",i){super(i),this.__src=t,this.__alt=e}createDOM(){const t=document.createElement("img");return t.setAttribute("src",this.__src),t.setAttribute("alt",this.__alt),t.style.maxWidth="100%",t}updateDOM(t,e){return t.__src!==this.__src&&e.setAttribute("src",this.__src),t.__alt!==this.__alt&&e.setAttribute("alt",this.__alt),!1}exportDOM(){const t=document.createElement("img");return t.setAttribute("src",this.__src),t.setAttribute("alt",this.__alt),{element:t}}exportJSON(){return{...super.exportJSON(),type:"image",src:this.__src,alt:this.__alt}}getSrc(){return this.getLatest().__src}getAlt(){return this.getLatest().__alt}decorate(){return null}isInline(){return!1}}}async initLexical(){await this.loadLexicalModules(),this.customNodes=await this.loadNodeModules(),this.nodeCompatCheckers=this.customNodes.filter(t=>"function"==typeof t.isVisualCompatible).map(t=>t.isVisualCompatible),this.nodePreprocessors=this.customNodes.filter(t=>"function"==typeof t.preprocessHtml).map(t=>t.preprocessHtml);const{lexical:t,richText:e,history:i,list:o,link:l,table:r,code:s}=this.lx,a={namespace:"KempoHtmlEditor",theme:{paragraph:"k-editor-p",heading:{h1:"k-editor-h1",h2:"k-editor-h2",h3:"k-editor-h3",h4:"k-editor-h4",h5:"k-editor-h5",h6:"k-editor-h6"},text:{underline:"td-u",strikethrough:"td-lt"},list:{ul:"k-editor-ul",ol:"k-editor-ol",listitem:"k-editor-li"},link:"k-editor-link",quote:"k-editor-quote",code:"k-editor-code-block",codeHighlight:{},table:"k-editor-table",tableCell:"k-editor-table-cell",tableCellHeader:"k-editor-table-cell-header"},nodes:[e.HeadingNode,e.QuoteNode,o.ListNode,o.ListItemNode,l.LinkNode,r.TableNode,r.TableCellNode,r.TableRowNode,s.CodeNode,s.CodeHighlightNode,this.StyledTextNode,this.ImageNode,...this.customNodes],onError:console.error,editorState:null};this.lexicalEditor=t.createEditor(a),this.lexicalEditor.setRootElement(this.lexicalContainer),(this.disabled||this.readonly)&&this.lexicalEditor.setEditable(!1),this.lexicalEditor._window=new Proxy(window,{get:(t,e)=>{if("getSelection"===e)return()=>this.shadowRoot.getSelection();const i=Reflect.get(t,e);return"function"==typeof i?i.bind(t):i}}),this.cleanupFns=[e.registerRichText(this.lexicalEditor),i.registerHistory(this.lexicalEditor,i.createEmptyHistoryState(),300)],o.registerList&&this.cleanupFns.push(o.registerList(this.lexicalEditor)),r.registerTable&&this.cleanupFns.push(r.registerTable(this.lexicalEditor)),s.registerCodeHighlighting&&this.cleanupFns.push(s.registerCodeHighlighting(this.lexicalEditor)),l.registerLink&&this.cleanupFns.push(l.registerLink(this.lexicalEditor,{validateUrl:t=>{try{return new URL(t),!0}catch{return!1}}})),this.value&&(this.isVisualCompatible(this.value)?this.importHtmlToLexical(this.value):(this.skipLexicalExport=!0,this.mode="code")),this.lexicalEditor.registerUpdateListener(({dirtyElements:t,dirtyLeaves:e})=>{0===t.size&&0===e.size||(this.debouncedSyncValue(),this.dispatchEvent(new CustomEvent("input",{detail:{value:this.exportHtmlFromLexical()},bubbles:!0})))}),this.lexicalEditor.registerCommand(t.SELECTION_CHANGE_COMMAND,()=>(this.updateSelection(),!1),t.COMMAND_PRIORITY_LOW)}async initMonaco(){if(!this.monacoEditor){if(this.monacoInitPromise)return this.monacoInitPromise;this.monacoInitPromise=this._initMonaco(),await this.monacoInitPromise,this.monacoInitPromise=null}}async _initMonaco(){const t=this.monacoSrc||window.kempo?.monacoUrl||"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min";await new Promise((e,i)=>{if(window.monaco)return void e();if(window.require?.defined?.("vs/editor/editor.main"))return void e();const o=document.querySelector(`script[src="${t}/vs/loader.js"]`);if(o)return void o.addEventListener("load",()=>{window.require.config({paths:{vs:`${t}/vs`}}),window.require(["vs/editor/editor.main"],()=>e(),i)});const l=document.createElement("script");l.src=`${t}/vs/loader.js`,l.onload=()=>{window.require.config({paths:{vs:`${t}/vs`}}),window.require(["vs/editor/editor.main"],()=>e(),i)},l.onerror=i,document.head.appendChild(l)}),this.monacoEditor=window.monaco.editor.create(this.monacoContainer,{value:o(this.value),language:"html",theme:this.resolveMonacoTheme(),minimap:{enabled:this.minimapEnabled},wordWrap:this.wordWrap?"on":"off",fontSize:this.fontSize,scrollBeyondLastLine:!1,automaticLayout:!0,tabSize:2,padding:{top:8},readOnly:this.disabled||this.readonly});const e=document.querySelector('link[href*="monaco"][href*="editor.main.css"]');if(e){const t=document.createElement("link");t.rel="stylesheet",t.href=e.href,this.shadowRoot.appendChild(t)}this.unsubscribeTheme=s(()=>{this.monacoEditor&&"auto"===this.editorTheme&&window.monaco.editor.setTheme(this.resolveMonacoTheme())}),this.monacoEditor.onDidChangeModelContent(()=>{this.skipValueSync=!0,this.value=this.monacoEditor.getValue(),this.skipValueSync=!1,this.updateFormValue(),this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0})),this.dispatchEvent(new CustomEvent("input",{detail:{value:this.value},bubbles:!0}))})}importHtmlToLexical(t){if(!this.lexicalEditor||!this.lx.lexicalHtml)return;const{lexical:e,lexicalHtml:i}=this.lx,o=(this.nodePreprocessors||[]).reduce((t,e)=>e(t),t);this.lexicalEditor.update(()=>{if(e.$getRoot().clear(),!o?.trim())return;const t=(new DOMParser).parseFromString(o,"text/html"),l=i.$generateNodesFromDOM(this.lexicalEditor,t);l.length>0&&e.$insertNodes(l)},{discrete:!0})}exportHtmlFromLexical(){if(!this.lexicalEditor||!this.lx.lexicalHtml)return this.value;let t="";return this.lexicalEditor.getEditorState().read(()=>{t=this.lx.lexicalHtml.$generateHtmlFromNodes(this.lexicalEditor,null)}),this.cleanExportedHtml(t)}isVisualCompatible(t){if(!t?.trim())return!0;const e=new Set(["script","style","meta","link","head","iframe","object","embed","canvas","video","audio","form","input","button","select","textarea","fieldset","label","noscript","template","slot","svg","math"]),i=this.nodeCompatCheckers||[],o=(new DOMParser).parseFromString(t,"text/html"),l=document.createTreeWalker(o.body,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_COMMENT);let r;for(;r=l.nextNode();)if(!i.some(t=>t(r))){if(r.nodeType===Node.COMMENT_NODE)return!1;if(e.has(r.tagName?.toLowerCase()))return!1}return!0}cleanExportedHtml(t){const e=(new DOMParser).parseFromString(t,"text/html");return e.body.querySelectorAll("[class]").forEach(t=>{const e=Array.from(t.classList).filter(t=>!t.startsWith("k-editor-")&&"td-u"!==t&&"td-lt"!==t);0===e.length?t.removeAttribute("class"):t.className=e.join(" ")}),e.body.querySelectorAll("[style]").forEach(t=>{const e=t.style.cssText.replace(/white-space:\s*pre-wrap;?\s*/g,"").trim();e?t.style.cssText=e:t.removeAttribute("style")}),e.body.querySelectorAll("span:not([class]):not([style]):not([id])").forEach(t=>{t.attributes.length||t.replaceWith(...t.childNodes)}),e.body.querySelectorAll("b > strong, i > em, b > b, strong > strong, i > i, em > em").forEach(t=>{t.replaceWith(...t.childNodes)}),e.body.querySelectorAll("pre[data-highlight-language], code[data-highlight-language]").forEach(t=>{t.removeAttribute("data-highlight-language"),t.removeAttribute("data-language")}),e.body.innerHTML}syncValueFromLexical(){this.lexicalEditor&&(this.lexicalValueSync=!0,this.value=this.exportHtmlFromLexical(),this.updateFormValue())}syncContentToEditors(){"visual"===this.mode&&this.lexicalEditor&&this.importHtmlToLexical(this.value)}async handleModeSwitch(t){"code"===this.mode?(this.lexicalEditor&&!this.skipLexicalExport&&(this.value=this.exportHtmlFromLexical()),this.skipLexicalExport=!1,await this.initMonaco(),this.monacoEditor&&(this.monacoEditor.setValue(o(this.value)),this.monacoEditor.layout())):"visual"===this.mode&&(this.monacoEditor&&(this.value=this.monacoEditor.getValue()),this.lexicalEditor&&this.importHtmlToLexical(this.value)),this.requestUpdate()}updateFormValue(){this.internals.setFormValue(this.getValue())}formResetCallback(){this.value=""}formStateRestoreCallback(t){this.value=t}formDisabledCallback(t){this.disabled=t}updateSelection=()=>{if("visual"!==this.mode||!this.lexicalEditor)return void(this.selection=null);const{lexical:t}=this.lx;this.lexicalEditor.getEditorState().read(()=>{const e=t.$getSelection();t.$isRangeSelection(e)&&!e.isCollapsed()?this.selection={text:e.getTextContent(),collapsed:!1}:(this.selection=null,this.cursor=e?{anchor:e.anchor,focus:e.focus}:null)})};setMode(t){return["visual","code"].includes(t)?"visual"!==t||this.isVisualCompatible(this.getValue())?(this.mode=t,this):(a.confirm("This html contains code that is not compatible with the visual editor, the incompatible code will be lost",e=>{e&&(this.mode=t)},{title:"Warning",confirmText:"Change Anyways"}),this):this}toggleMode(){return this.setMode("visual"===this.mode?"code":"visual")}getValue(){if("visual"===this.mode&&this.lexicalEditor)this.skipValueSync=!0,this.value=this.exportHtmlFromLexical(),this.skipValueSync=!1;else if("code"===this.mode&&this.monacoEditor)return this.monacoEditor.getValue();return this.value}setValue(t){return this.lexicalEditor&&"visual"===this.mode&&!this.isVisualCompatible(t)?(this.value=t,this.skipLexicalExport=!0,this.mode="code",this.updateFormValue(),this):(this.skipValueSync=!0,this.value=t,"visual"===this.mode?this.syncContentToEditors():"code"===this.mode&&this.monacoEditor&&this.monacoEditor.setValue(o(t)),this.updateFormValue(),this.skipValueSync=!1,this)}clear(){return this.setValue("")}bold(){return this.lexicalFormat("bold"),this}italic(){return this.lexicalFormat("italic"),this}underline(){return this.lexicalFormat("underline"),this}strikethrough(){return this.lexicalFormat("strikethrough"),this}inlineCode(){return this.lexicalFormat("code"),this}orderedList(){return"visual"===this.mode&&this.lexicalEditor?(this.lexicalEditor.update(()=>{this.lx.list.$insertList("number")},{discrete:!0}),this):this}unorderedList(){return"visual"===this.mode&&this.lexicalEditor?(this.lexicalEditor.update(()=>{this.lx.list.$insertList("bullet")},{discrete:!0}),this):this}bulletList(){return this.unorderedList()}numberList(){return this.orderedList()}toggleWordWrap(){return this.setWordWrap(!this.wordWrap)}toggleMinimap(){return this.setMinimap(!this.minimapEnabled)}formatCode(){return this.monacoEditor?.getAction("editor.action.formatDocument")?.run(),this}alignLeft(){return this.lexicalFormatElement("left"),this}alignCenter(){return this.lexicalFormatElement("center"),this}alignRight(){return this.lexicalFormatElement("right"),this}alignJustify(){return this.lexicalFormatElement("justify"),this}setTextColor(t){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:e,selection:i}=this.lx;return this.lexicalEditor.update(()=>{const o=e.$getSelection();e.$isRangeSelection(o)&&i.$patchStyleText(o,{color:t})},{discrete:!0}),this}removeTextColor(){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:t,selection:e}=this.lx;return this.lexicalEditor.update(()=>{const i=t.$getSelection();t.$isRangeSelection(i)&&e.$patchStyleText(i,{color:null})},{discrete:!0}),this}setTextBackgroundColor(t){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:e,selection:i}=this.lx;return this.lexicalEditor.update(()=>{const o=e.$getSelection();e.$isRangeSelection(o)&&i.$patchStyleText(o,{"background-color":t})},{discrete:!0}),this}removeTextBackgroundColor(){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:t,selection:e}=this.lx;return this.lexicalEditor.update(()=>{const i=t.$getSelection();t.$isRangeSelection(i)&&e.$patchStyleText(i,{"background-color":null})},{discrete:!0}),this}removeFormat(){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:t,selection:e}=this.lx;return this.lexicalEditor.update(()=>{const i=t.$getSelection();t.$isRangeSelection(i)&&(i.getNodes().forEach(e=>{t.$isTextNode(e)&&e.setFormat(0)}),e.$patchStyleText(i,{color:null,"background-color":null}))},{discrete:!0}),this}formatBlock(t){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:e,richText:i,code:o}=this.lx;return this.lexicalEditor.update(()=>{const l=e.$getSelection();if(!e.$isRangeSelection(l))return;const r=l.anchor.getNode().getTopLevelElementOrThrow(),s=o.$isCodeNode(r);let a;if("p"===t)a=e.$createParagraphNode();else if(t.match(/^h[1-6]$/))a=i.$createHeadingNode(t);else if("blockquote"===t)a=i.$createQuoteNode();else{if("pre"!==t)return;a=o.$createCodeNode()}if(s&&"pre"!==t){const t=r.getTextContent();r.replace(a),a.append(e.$createTextNode(t))}else{const t=r.getChildren();r.replace(a),t.forEach(t=>a.append(t))}a.selectEnd()},{discrete:!0}),this}isSelectionInCodeBlock(){if("visual"!==this.mode||!this.lexicalEditor)return!1;let t=!1;const{lexical:e,code:i}=this.lx;return this.lexicalEditor.getEditorState().read(()=>{const o=e.$getSelection();e.$isRangeSelection(o)&&(t=i.$isCodeNode(o.anchor.getNode().getTopLevelElementOrThrow()))}),t}getTableAtSelection(){if("visual"!==this.mode||!this.lexicalEditor)return null;let t=null;const{lexical:e,table:i}=this.lx;return this.lexicalEditor.getEditorState().read(()=>{const o=e.$getSelection();if(!e.$isRangeSelection(o))return;let l=o.anchor.getNode();for(;l;){if(i.$isTableNode(l)){const e=l.getChildren(),o=[];let r=!1,s=0;e.forEach((t,e)=>{const l=[];t.getChildren().forEach(t=>{0===e&&i.$isTableCellNode(t)&&t.getHeaderStyles()===i.TableCellHeaderStates.ROW&&(r=!0),l.push(t.getTextContent())}),l.length>s&&(s=l.length),o.push(l)}),t={key:l.getKey(),rows:r?e.length-1:e.length,cols:s,hasHeaders:r,cellData:o};break}l=l.getParent()}}),t}removeTableByKey(t){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:e}=this.lx;return this.lexicalEditor.update(()=>{const i=e.$getNodeByKey(t);i&&i.remove()},{discrete:!0}),this}insertHTML(t){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:e,lexicalHtml:i}=this.lx;return this.lexicalEditor.update(()=>{const o=(new DOMParser).parseFromString(t,"text/html"),l=i.$generateNodesFromDOM(this.lexicalEditor,o);e.$insertNodes(l)},{discrete:!0}),this}insertAtCursor(t){return this.insertHTML(t)}insertTable(t,e,i=!1,o=null){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:l,table:r}=this.lx;return this.lexicalEditor.update(()=>{const s=t+(i?1:0),a=[];for(let t=0;t<s;t++){const s=[];for(let a=0;a<e;a++){const e=i&&0===t,n=e?r.TableCellHeaderStates.ROW:r.TableCellHeaderStates.NO_STATUS,c=r.$createTableCellNode(n),d=o?.[t]?.[a]??(e?`Header ${a+1}`:""),h=l.$createParagraphNode();h.append(l.$createTextNode(d||" ")),c.append(h),s.push(c)}a.push(r.$createTableRowNode().append(...s))}const n=r.$createTableNode().append(...a),c=l.$getSelection();if(l.$isRangeSelection(c)){c.anchor.getNode().getTopLevelElementOrThrow().insertAfter(n);const t=l.$createParagraphNode();n.insertAfter(t),t.selectEnd()}else{const t=l.$getRoot();t.append(n),t.append(l.$createParagraphNode())}},{discrete:!0}),this}insertElementAtCursor(t){return this.insertHTML(t.outerHTML)}replaceSelectionWithElement(t){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:e,lexicalHtml:i}=this.lx;return this.lexicalEditor.update(()=>{const o=e.$getSelection();if(!e.$isRangeSelection(o))return;o.removeText();const l=(new DOMParser).parseFromString(t.outerHTML,"text/html"),r=i.$generateNodesFromDOM(this.lexicalEditor,l);e.$insertNodes(r)},{discrete:!0}),this}wrapSelection(t,e,i=null){if("visual"!==this.mode||!this.lexicalEditor)return this;const o=i||this.getSelectedText();return o?this.insertHTML(t+o+e):this}getSelection(){if("visual"!==this.mode||!this.lexicalEditor)return null;let t=null;const{lexical:e}=this.lx;return this.lexicalEditor.getEditorState().read(()=>{const i=e.$getSelection();e.$isRangeSelection(i)&&!i.isCollapsed()&&(t={text:i.getTextContent(),html:i.getTextContent(),selection:i})}),t}getSelectedText(){let t="";if("visual"!==this.mode||!this.lexicalEditor)return t;const{lexical:e}=this.lx;return this.lexicalEditor.getEditorState().read(()=>{const i=e.$getSelection();e.$isRangeSelection(i)&&(t=i.getTextContent())}),t}getSelectedHTML(){return this.getSelectedText()}selectAll(){if("visual"===this.mode&&this.lexicalEditor){const{lexical:t}=this.lx;this.lexicalEditor.update(()=>{t.$selectAll()},{discrete:!0})}else if(this.monacoEditor){const t=this.monacoEditor.getModel();t&&this.monacoEditor.setSelection(t.getFullModelRange())}return this}replaceSelection(t){return this.insertHTML(t)}deleteSelection(){return"visual"===this.mode?this.lexicalCmd("DELETE_CHARACTER_COMMAND",!1):this.monacoEditor&&this.monacoEditor.trigger("keyboard","deleteAllLeft",null),this}getValueWithSelectionMarkers(){if("visual"!==this.mode||!this.lexicalEditor)return{html:this.value,hasCursor:!1,hasSelection:!1,selectedText:""};let t={html:this.exportHtmlFromLexical(),hasCursor:!1,hasSelection:!1,selectedText:""};const{lexical:e}=this.lx;return this.lexicalEditor.getEditorState().read(()=>{const i=e.$getSelection();e.$isRangeSelection(i)&&(i.isCollapsed()?t.hasCursor=!0:(t.hasSelection=!0,t.selectedText=i.getTextContent()))}),t}setValueFromSelectionMarkers(t){return this.setValue(t)}captureSelection(){return this.selection}restoreSavedSelection(){return!1}clearSavedSelection(){this.savedSelection=null}createLink(t){if("visual"!==this.mode||!this.lexicalEditor)return this;const{link:e}=this.lx;return this.lexicalEditor.update(()=>{e.$toggleLink(t)},{discrete:!0}),this}createLinkWithText(t,e){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:i,link:o}=this.lx;return this.lexicalEditor.update(()=>{const l=i.$getSelection();i.$isRangeSelection(l)&&!l.isCollapsed()&&l.removeText();const r=o.$createLinkNode(t);r.append(i.$createTextNode(e)),i.$insertNodes([r])},{discrete:!0}),this}unlink(){if("visual"!==this.mode||!this.lexicalEditor)return this;const{lexical:t,link:e}=this.lx;return this.lexicalEditor.update(()=>{const i=t.$getSelection();t.$isRangeSelection(i)&&i.getNodes().forEach(t=>{const i=t.getParent();i&&e.$isLinkNode?.(i)&&(i.getChildren().forEach(t=>i.insertBefore(t)),i.remove())})},{discrete:!0}),this}insertImage(t,{alt:e=""}={}){const i=String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return this.insertHTML(`<img src="${encodeURI(t)}" alt="${i}" />`)}undo(){return"code"===this.mode?this.monacoEditor?.trigger("toolbar","undo"):this.lexicalCmd("UNDO_COMMAND",void 0),this}redo(){return"code"===this.mode?this.monacoEditor?.trigger("toolbar","redo"):this.lexicalCmd("REDO_COMMAND",void 0),this}copyToClipboard(){return navigator.clipboard.writeText(this.getValue()),this}setEditorTheme(t){return["auto","light","dark"].includes(t)&&(this.editorTheme=t),this.monacoEditor&&window.monaco.editor.setTheme(this.resolveMonacoTheme()),this}openFind(){return this.monacoEditor?.getAction("actions.find")?.run(),this}foldAll(){return this.monacoEditor?.getAction("editor.foldAll")?.run(),this}unfoldAll(){return this.monacoEditor?.getAction("editor.unfoldAll")?.run(),this}enterFullscreen(){return this.fullscreen=!0,document.body.classList.add("no-scroll"),this.dispatchEvent(new CustomEvent("fullscreen-changed",{detail:{fullscreen:!0},bubbles:!0})),this}exitFullscreen(){return this.fullscreen=!1,document.body.classList.remove("no-scroll"),this.dispatchEvent(new CustomEvent("fullscreen-changed",{detail:{fullscreen:!1},bubbles:!0})),this}toggleFullscreen(){return this.fullscreen?this.exitFullscreen():this.enterFullscreen()}increaseFontSize(){return this.fontSize=Math.min(this.fontSize+2,40),this.monacoEditor?.updateOptions({fontSize:this.fontSize}),this}decreaseFontSize(){return this.fontSize=Math.max(this.fontSize-2,8),this.monacoEditor?.updateOptions({fontSize:this.fontSize}),this}setWordWrap(t){return this.wordWrap=t,this.monacoEditor?.updateOptions({wordWrap:t?"on":"off"}),this}setMinimap(t){return this.minimapEnabled=t,this.monacoEditor?.updateOptions({minimap:{enabled:t}}),this}resolveMonacoTheme(){return"dark"===this.editorTheme?"vs-dark":"light"===this.editorTheme?"vs":"dark"===r()?"vs-dark":"vs"}lexicalCmd(t,e){if("visual"!==this.mode||!this.lexicalEditor)return;const i=this.lx.lexical?.[t];i&&this.lexicalEditor.dispatchCommand(i,e)}lexicalFormat(t){if("visual"!==this.mode||!this.lexicalEditor)return;const{lexical:e}=this.lx;this.lexicalEditor.update(()=>{const i=e.$getSelection();e.$isRangeSelection(i)&&i.formatText(t)},{discrete:!0})}lexicalFormatElement(t){"visual"===this.mode&&this.lexicalEditor&&this.lexicalEditor.dispatchCommand(this.lx.lexical.FORMAT_ELEMENT_COMMAND,t)}render(){const e=this.constructor.controlSets[this.controls]??{};return t`
			${this.hasTopToolbar?t`
				<div class="toolbar-top bb">
					<div class="toolbar-start">
									<slot name="toolbar-top-left">${e.topLeft??""}</slot>
					</div>
					<div class="toolbar-end">
									<slot name="toolbar-top-right">${e.topRight??""}</slot>
					</div>
				</div>
			`:""}
			<div class="editor-container">
				<div
					class="lexical-editor"
					contenteditable=${this.disabled||this.readonly?"false":"true"}
					?hidden=${"visual"!==this.mode}
				></div>
				<div
					class="monaco-editor-container"
					?hidden=${"code"!==this.mode}
				></div>
			</div>
			${this.hasBottomToolbar?t`
				<div class="toolbar-bottom bt">
					<div class="toolbar-start">
									<slot name="toolbar-bottom-left">${e.bottomLeft??""}</slot>
					</div>
					<div class="toolbar-end">
									<slot name="toolbar-bottom-right">${e.bottomRight??""}</slot>
					</div>
				</div>
			`:""}
		`}static styles=e`
		:host {
			display: flex;
			flex-direction: column;
			gap: 0;
			height: 400px;
			background: var(--c_bg, rgb(249, 249, 249));
		}
		:host([fullscreen]) {
			position: fixed;
			inset: 0;
			width: auto;
			height: auto;
			z-index: 10000;
		}
		:host([disabled]) {
			opacity: 0.6;
		}
		/* disabled blocks all interaction -- toolbar AND editor. Lexical
		   and Monaco both prevent typing on their own; pointer-events: none
		   also stops focus / cursor placement, matching native form control
		   semantics. */
		:host([disabled]) .toolbar-top,
		:host([disabled]) .toolbar-bottom,
		:host([disabled]) .editor-container {
			pointer-events: none;
		}
		/* readonly keeps the editor interactive (so users can place a cursor
		   to select / copy) but mutes the toolbar so its buttons can't
		   mutate the document. */
		:host([readonly]) .toolbar-top,
		:host([readonly]) .toolbar-bottom {
			pointer-events: none;
			opacity: 0.5;
		}
		.toolbar-top,
		.toolbar-bottom {
			display: flex;
			align-items: center;
			background: var(--bg-secondary);
			min-height: 40px;
			width: 100%;
		}
		.toolbar-start {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
		}
		.toolbar-end {
			display: flex;
			flex-wrap: wrap-reverse;
			align-items: center;
			justify-content: flex-end;
			margin-left: auto;
		}
		.editor-container {
			position: relative;
			flex: 1;
			min-height: 0;
			overflow: hidden;
		}
		.lexical-editor,
		.monaco-editor-container {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			overflow: auto;
		}
		.lexical-editor {
			padding: var(--editor_padding, 1rem);
			border: 1px solid var(--border-color);
			background: var(--bg-primary);
			color: var(--text-primary);
			font-family: inherit;
			font-size: inherit;
			line-height: 1.5;
			outline: none;
			/* Always show a slim scrollbar when content overflows (macOS would
			   otherwise hide overlay scrollbars when not actively scrolling,
			   leaving users unaware they can scroll back). */
			scrollbar-width: thin;
			scrollbar-color: var(--c_border, rgba(128,128,128,0.4)) transparent;
		}
		.lexical-editor::-webkit-scrollbar {
			width: 8px;
			height: 8px;
		}
		.lexical-editor::-webkit-scrollbar-track {
			background: transparent;
		}
		.lexical-editor::-webkit-scrollbar-thumb {
			background: var(--c_border, rgba(128,128,128,0.4));
			border-radius: 4px;
		}
		.lexical-editor::-webkit-scrollbar-thumb:hover {
			background: rgba(128,128,128,0.7);
		}
		.lexical-editor:focus {
			border-color: var(--primary-color);
		}
		.lexical-editor p { margin: 0 0 0.5em 0; }
		.lexical-editor h1,
		.lexical-editor h2,
		.lexical-editor h3,
		.lexical-editor h4,
		.lexical-editor h5,
		.lexical-editor h6 { margin: 0.5em 0; }
		.lexical-editor ul,
		.lexical-editor ol { margin: 0.5em 0; padding-left: 1.5em; }
		.lexical-editor blockquote {
			margin: 0.5em 0;
			padding-left: 1em;
			border-left: 3px solid var(--border-color, #ccc);
			color: var(--text-secondary, #666);
		}
		.lexical-editor a { color: var(--primary-color, #007acc); }
		.lexical-editor code {
			background: var(--bg-secondary, #f5f5f5);
			padding: 0.125em 0.25em;
			border-radius: 3px;
			font-family: monospace;
		}
		.lexical-editor pre {
			background: var(--bg-secondary, #f5f5f5);
			padding: 1em;
			border-radius: 4px;
			font-family: monospace;
			overflow-x: auto;
			white-space: pre-wrap;
		}
		.lexical-editor table {
			border-collapse: collapse;
			width: 100%;
		}
		.lexical-editor th,
		.lexical-editor td {
			border: 1px solid var(--border-color, #ccc);
			padding: 0.5rem;
		}
		.lexical-editor th {
			background-color: var(--bg-secondary, #f5f5f5);
			text-align: left;
		}
		.monaco-editor-container {
			border: 1px solid var(--border-color);
		}
	`;static controlSets={minimal:{topLeft:t`
				<k-control-group>
					<kc-bold></kc-bold>
					<kc-italic></kc-italic>
					<kc-underline></kc-underline>
				</k-control-group>
				<k-control-group>
					<kc-bullet-list></kc-bullet-list>
					<kc-number-list></kc-number-list>
				</k-control-group>
			`,topRight:null,bottomLeft:null,bottomRight:null},normal:{topLeft:t`
				<k-control-group>
					<kc-bold></kc-bold>
					<kc-italic></kc-italic>
					<kc-underline></kc-underline>
					<kc-strikethrough></kc-strikethrough>
				</k-control-group>
				<kc-inline-code></kc-inline-code>
				<kc-menu>
					<k-icon slot="icon" name="format_paragraph"></k-icon>
					<span slot="label">Text Style</span>
					<kc-format-block tag="p">Paragraph</kc-format-block>
					<kc-format-block tag="h1">Heading 1</kc-format-block>
					<kc-format-block tag="h2">Heading 2</kc-format-block>
					<kc-format-block tag="h3">Heading 3</kc-format-block>
					<kc-format-block tag="blockquote">Blockquote</kc-format-block>
					<kc-code-block></kc-code-block>
				</kc-menu>
				<k-control-group>
					<kc-bullet-list></kc-bullet-list>
					<kc-number-list></kc-number-list>
				</k-control-group>
			`,topRight:t`
				<k-control-group>
					<kc-align-left></kc-align-left>
					<kc-align-center></kc-align-center>
					<kc-align-right></kc-align-right>
				</k-control-group>
				<kc-create-link></kc-create-link>
				<kc-insert-image></kc-insert-image>
				<kc-format-code></kc-format-code>
				<kc-mode></kc-mode>
			`,bottomLeft:t`<kc-word-count></kc-word-count>`,bottomRight:null},full:{topLeft:t`
				<k-control-group>
					<kc-bold></kc-bold>
					<kc-italic></kc-italic>
					<kc-underline></kc-underline>
					<kc-strikethrough></kc-strikethrough>
				</k-control-group>
				<kc-inline-code></kc-inline-code>
				<kc-menu>
					<k-icon slot="icon" name="format_paragraph"></k-icon>
					<span slot="label">Text Style</span>
					<kc-format-block tag="p">Paragraph</kc-format-block>
					<kc-format-block tag="h1">Heading 1</kc-format-block>
					<kc-format-block tag="h2">Heading 2</kc-format-block>
					<kc-format-block tag="h3">Heading 3</kc-format-block>
					<kc-format-block tag="blockquote">Blockquote</kc-format-block>
					<kc-code-block></kc-code-block>
				</kc-menu>
				<k-control-group>
					<kc-bullet-list></kc-bullet-list>
					<kc-number-list></kc-number-list>
				</k-control-group>
				<k-control-group>
					<kc-undo></kc-undo>
					<kc-redo></kc-redo>
				</k-control-group>
				<k-control-group>
					<kc-format-code></kc-format-code>
					<kc-copy-code></kc-copy-code>
					<kc-find-replace></kc-find-replace>
				</k-control-group>
				<k-control-group>
					<kc-word-wrap></kc-word-wrap>
					<kc-minimap></kc-minimap>
					<kc-fold-all></kc-fold-all>
				</k-control-group>
				<kc-font-size></kc-font-size>
			`,topRight:t`
				<k-control-group>
					<kc-align-left></kc-align-left>
					<kc-align-center></kc-align-center>
					<kc-align-right></kc-align-right>
					<kc-align-justify></kc-align-justify>
				</k-control-group>
				<kc-create-link></kc-create-link>
				<k-control-group>
					<kc-text-color></kc-text-color>
					<kc-text-background-color></kc-text-background-color>
				</k-control-group>
				<kc-clear-formatting></kc-clear-formatting>
				<kc-insert-image></kc-insert-image>
				<kc-insert-table></kc-insert-table>
				<kc-editor-theme></kc-editor-theme>
				<kc-mode></kc-mode>
				<kc-fullscreen></kc-fullscreen>
			`,bottomLeft:t`
				<kc-word-count></kc-word-count>
				<kc-character-count></kc-character-count>
			`,bottomRight:null},"":{topLeft:null,topRight:null,bottomLeft:null,bottomRight:null}}}customElements.define("k-html-editor",c);