"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var query_service_1 = require("./query.service");
var person_service_1 = require("./person.service");
var query_1 = require("./query");
var AppComponent = (function () {
    function AppComponent(_personService, _queryService) {
        this._personService = _personService;
        this._queryService = _queryService;
        this.title = 'The Wise Finder';
        this.hitsPerPage = 5;
        this.sorting = "Relevance";
    }
    AppComponent.prototype.onSelect = function (person) {
        this.selectedPerson = person;
    };
    AppComponent.prototype.ngOnInit = function () {
        this.resetVars(); //(re)set some variables. This will always be called on a new search so it needs its own method
    };
    AppComponent.prototype.resetVars = function () {
        this.pages = [];
        this.persons = [];
        this.numberOfHits = null;
        this.numberOfPages = null;
        this.selectedPerson = null;
        this.spellSuggestions = [];
        this.userInput = "";
        this._queryService.setPage(1);
        this._queryService.updateSearchQuery(this.userInput);
    };
    AppComponent.prototype.getAllData = function () {
        var _this = this;
        this._personService
            .getAllData(this._queryService.getQuery())
            .then(function (response) {
            _this.persons = response.documentList.documents;
            //this.totalPages = response.documentList.pagination.pages.length as number;
            _this.numberOfHits = response.stats.totalHits;
            _this.numberOfPages = response.documentList.pagination.pages.length;
            _this.generatePages(response.documentList.pagination.pages.length);
            _this.spellSuggestions = response.spell.suggestions;
        });
    };
    AppComponent.prototype.search = function () {
        //this is called when the user performs a fresh/new search, we will always want to start on page 1 so only the search query itself is needed.
        event.preventDefault();
        //ask the personService to perform the API query
        this._queryService.setPage(1);
        this._queryService.updateSearchQuery(this.userInput);
        console.log(this._queryService.getQuery());
        this.getAllData();
    };
    AppComponent.prototype.changePage = function (n) {
        this._queryService.setPage(n);
        this.getPersons(); // Need to do a new query now since we switched page.
    };
    AppComponent.prototype.nextPage = function () {
        //this._queryService.setPage(this._queryService.getPage()+1);
        this.changePage(this._queryService.getPage() + 1);
    };
    AppComponent.prototype.getPersons = function () {
        var _this = this;
        this._personService
            .getPersons(this._queryService.getQuery())
            .then(function (response) {
            _this.persons = response;
        });
    };
    AppComponent.prototype.generatePages = function (n) {
        this.pages = []; //clear the array when making a new search! Remember this needs to be called when changing the number of hits per page too, so it should be in this method
        for (var i = 0; i < n; i++) {
            this.pages[i] = i + 1;
        }
    };
    AppComponent.prototype.updateHitsPerPage = function (n) {
        this.hitsPerPage = n;
        this._queryService.setHitsPerPage(n);
        if (this.persons.length > 0) {
            //only redo the search if we actually have some hits already. Otherwise we'll just set up the hitsperpage variable.
            this.search();
        }
    };
    AppComponent.prototype.correctSpelling = function (suggestion) {
        this.resetVars();
        this.userInput = suggestion;
        this.search();
    };
    AppComponent.prototype.changeSorting = function (sortMethod) {
        this.sorting = sortMethod;
        this._queryService.setSorting(this.sorting);
        if (this.persons.length > 0) {
            this.search();
        }
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n    <h1>{{title}}</h1>\n    <form #f=\"ngForm\" (ngSubmit)=\"search()\" novalidate>\n      <input name=\"first\" [(ngModel)]=\"userInput\" required #first=\"ngModel\" placeholder = \"Enter Search Query Here\">\n      <button>Submit</button>\n    </form>\n\n    <span *ngIf=\"numberOfHits != null\" class=\"badge\">Your Search Generated {{ numberOfHits }} hits.</span>\n\n    <div *ngIf=\"spellSuggestions.length > 0\" class=\"badge\"> \n      <div> Did you perhaps intend to search for: </div>\n      <ul>\n        <li *ngFor=\"let suggestion of spellSuggestions\" (click)=\"correctSpelling(suggestion)\">\n          <div> {{ suggestion }} </div>\n        </li>\n      </ul>\n    </div>\n\n    <div class=\"dropdown\">\n      <button class=\"dropbtn\">Hits Per Page: {{ hitsPerPage }}</button>\n      <div class=\"dropdown-content\">\n        <a (click)=\"updateHitsPerPage(5)\">5</a>\n        <a (click)=\"updateHitsPerPage(10)\">10</a>\n        <a (click)=\"updateHitsPerPage(15)\">15</a>\n        <a (click)=\"updateHitsPerPage(20)\">20</a>\n      </div>\n    </div>\n\n    <div class=\"dropdown\">\n      <button class=\"dropbtn\">Sort By: {{ sorting }}</button>\n      <div class=\"dropdown-content\">\n        <a (click)=\"changeSorting('Relevance')\">Relevance</a>\n        <a (click)=\"changeSorting('Name, Ascending')\">Name, Ascending</a>\n        <a (click)=\"changeSorting('Name, Descending')\">Name, Descending</a>        \n      </div>\n    </div>\n\n    <ul class=\"persons\">\n      <li *ngFor=\"let person of persons\" (click)=\"onSelect(person)\">\n        <span class=\"badge\">{{person.firstname}}</span> {{person.city}}        \n      </li>      \n      <person-detail [person]=\"selectedPerson\"></person-detail>\n    </ul>\n\n    <li *ngFor=\"let page of pages\" (click)=\"changePage(page)\">\n      <button class=\"badge\">{{page}}</button>\n    </li>\n    ",
        styleUrls: ['./app.component.css'],
        providers: [person_service_1.PersonService, query_service_1.QueryService, query_1.Query]
    }),
    __metadata("design:paramtypes", [person_service_1.PersonService,
        query_service_1.QueryService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map