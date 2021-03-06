"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
require("rxjs/add/operator/toPromise");
var core_1 = require("@angular/core");
var query_1 = require("./query");
var QueryService = (function () {
    function QueryService() {
        this._APIURL = 'http://search.i3demo.findwise.com/rest/apps/demo/searchers/programming_assinment?';
        this._query = new query_1.Query();
    }
    QueryService.prototype.updateSearchQuery = function (rawInput) {
        this.setRawQuery(rawInput);
        this.fromRawToQuery(rawInput);
        this.addPaginationToQuery(this.getPage());
        this.addSortingToQuery(this.getSorting());
    };
    QueryService.prototype.setPage = function (p) {
        this._query.page = p;
        this.updateSearchQuery(this._query.rawQuery); // We need to rebuild the query string. This is easier than removing the pagination part of the string and remaking it.
    };
    QueryService.prototype.getPage = function () {
        return this._query.page;
    };
    QueryService.prototype.setRawQuery = function (s) {
        this._query.rawQuery = s;
    };
    QueryService.prototype.getRawQuery = function () {
        return this._query.rawQuery;
    };
    QueryService.prototype.setHitsPerPage = function (n) {
        this._query.hitsPerPage = n;
    };
    QueryService.prototype.fromRawToQuery = function (r) {
        r = r.replace(/\s+/g, "+");
        r = this._APIURL + "q=" + r;
        this._query.searchQuery = r;
    };
    QueryService.prototype.addPaginationToQuery = function (p) {
        var offset = (p - 1) * 5;
        var pagination = "&offset=" + offset.toString() + "&hits=" + this._query.hitsPerPage.toString();
        this._query.searchQuery += pagination;
    };
    QueryService.prototype.addSortingToQuery = function (s) {
        var sorting = "&sort=" + s;
        this._query.searchQuery += sorting;
    };
    QueryService.prototype.getQuery = function () {
        return this._query.searchQuery;
    };
    QueryService.prototype.setSorting = function (s) {
        this._query.sorting = s;
    };
    QueryService.prototype.getSorting = function () {
        if (this._query.sorting === "Relevance") {
            return "name.score";
        }
        else if (this._query.sorting === "Name, Ascending") {
            return "name.asc";
        }
        else if (this._query.sorting === "Name, Descending") {
            return "name.desc";
        }
        else {
            //not really required but might be good for future security
            return "name.score";
        }
    };
    return QueryService;
}());
QueryService = __decorate([
    core_1.Injectable()
], QueryService);
exports.QueryService = QueryService;
//# sourceMappingURL=query.service.js.map