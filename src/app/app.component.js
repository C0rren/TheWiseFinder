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
        this.numberOfHitsChoices = [5, 10, 15, 20];
        this.sortingChoices = ["Relevance", "Name, Ascending", "Name, Descending"];
    }
    AppComponent.prototype.ngOnInit = function () {
        this.resetVars(); //(re)set some variables. This will always be called on a new search so it needs its own method
    };
    AppComponent.prototype.resetVars = function () {
        this.pages = [];
        this.persons = [];
        this.numberOfHits = null;
        this.numberOfPages = null;
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
        this._queryService.setHitsPerPage(this.hitsPerPage);
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
    AppComponent.prototype.correctSpelling = function (suggestion) {
        this.resetVars();
        this.userInput = suggestion;
        this.search();
    };
    AppComponent.prototype.updatedHitsPerPage = function () {
        //this.hitsPerPage is bound with ngModel from the select, this is just to let the queryservice know we want a new query with the updated hits per page.  
        if (this.persons.length > 0) {
            //only redo the search if we actually have some hits already. Otherwise we'll just set up the hitsperpage variable.
            this.search();
        }
    };
    AppComponent.prototype.updatedSorting = function () {
        //this.sorting is bound with ngModel from the select, this is just to let the queryservice know we want a new query with the updated sorting.    
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
        template: "\n    <div class=\"container\">\n      <div class=\"main\">\n        <section class=\"header\">\n          <h1 class = \"title\">{{title}}</h1>\n        </section>\n\n        <div class=\"row padded\">\n          <div class=\"three columns\">\n            <label for=\"sortingSelect\">Sort By: </label>\n            <select class=\"form-control\" required [(ngModel)]=\"sorting\" class=\"u-full-width\" (change)=\"updatedSorting()\">\n              <option *ngFor=\"let sort of sortingChoices\" [ngValue]=\"sort\">{{sort}}</option>\n            </select>\n          </div>\n\n          <div class=\"three columns\">\n            <label for=\"hitsPerPageSelect\">Hits Per Page: </label>\n            <select class=\"form-control\" required [(ngModel)]=\"hitsPerPage\" class=\"u-full-width\" (change)=\"updatedHitsPerPage()\">\n              <option *ngFor=\"let num of numberOfHitsChoices\" [ngValue]=\"num\">{{num}}</option>\n            </select>\n          </div>\n        </div> \n\n        <form class = \"padded\" #f=\"ngForm\" (ngSubmit)=\"search()\" novalidate>\n          <div class=\"row\">\n            <div class=\"twelve columns\">\n              <input id = \"mainSearchWindow\" class=\"u-full-width form-control\" type=\"text\" name=\"first\" [(ngModel)]=\"userInput\" required #first=\"ngModel\" placeholder = \"Search\" >\n            </div>\n          </div>        \n        </form>    \n\n        <div class = \"row\" id = \"numberOfResults\">\n          <div class = \"twelve columns\" *ngIf=\"numberOfHits != null\">Your Search Generated <b>{{ numberOfHits }}</b> hits.</div>\n        </div>\n\n        <div *ngIf=\"spellSuggestions.length > 0\" class=\"row\"> \n          <div class = \"twelve columns\"> Did you perhaps intend to search for: \n            <div *ngFor=\"let suggestion of spellSuggestions\" (click)=\"correctSpelling(suggestion)\">\n              <a>{{ suggestion }}</a>\n            </div>\n          </div>\n        </div>     \n\n        <ng-container *ngFor = \"let person of persons; let i = index\" class=\"row\">\n          <ng-container *ngIf = \"i % 2 === 0\">\n            <div class = \"row padded personRow\">\n              <ng-container *ngFor = \"let j of [0,1]\">\n                <div *ngIf = \"persons[i+j] != undefined\" class = \"six columns personDiv\">\n                  {{persons[i+j].firstname + \" \" + persons[i+j].lastname}}<br>                 \n                  {{persons[i+j].phone}}<br>\n                  {{persons[i+j].email}}\n                </div> \n              </ng-container> \n            </div>\n          </ng-container>            \n        </ng-container>              \n      </div>  \n    </div>\n\n    <div class=\"container searchContainer\">      \n      <div class=\"row Aligner\" *ngIf=\"pages.length > 1\">\n        <div class = \"one column Aligner-item\" id=\"pagesLabel\">Page: </div>\n        <div class = \"one column Aligner-item\" *ngFor=\"let page of pages\" (click)=\"changePage(page)\">\n          <a class=\"pageChange\">{{page}}</a>\n        </div>\n      </div>         \n    </div>\n\n    ",
        styleUrls: ['./app.component.css'],
        providers: [person_service_1.PersonService, query_service_1.QueryService, query_1.Query]
    }),
    __metadata("design:paramtypes", [person_service_1.PersonService,
        query_service_1.QueryService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map