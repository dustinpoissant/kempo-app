import TableControl from"./TableControl.js";import{html}from"../../lit-all.min.js";import debounce from"../../utils/debounce.js";export default class Search extends TableControl{static properties={searchTerm:{type:String}};constructor(){super({maxWidth:200}),this.debouncedSearch=debounce(this.performSearch,200)}handleInput=e=>{this.searchTerm=e.target.value,this.debouncedSearch()};performSearch=()=>{this.table&&(!this.searchTerm||this.searchTerm.length<3?this.table.showAllRecords():this.table.search(this.searchTerm))};render(){return html`
			<input
				type="search"
				placeholder="Search"
				class="px pyh"
				.value="${this.searchTerm||""}"
				@input="${this.handleInput}"
			/>
		`}}customElements.define("k-tc-search",Search);