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
require("rxjs/add/operator/toPromise");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var PersonService = (function () {
    function PersonService(http) {
        this.http = http;
        this._APIURL = 'search.i3demo.findwise.com/rest/apps/demo/searchers/programming_assinment?';
    }
    PersonService.prototype.getPersons = function (rawInput) {
        this.query.rawString = rawInput;
        this.query.page = 1; //replace with pager later
        this.fromRawToQuery(this.query.rawString);
        return this.executeQuery();
    };
    PersonService.prototype.fromRawToQuery = function (r) {
        r = r.replace(/\s+/g, "+");
        r = this._APIURL + "q=" + r;
        this.query.searchQuery = r;
        this.addPaginationToQuery(this.query.page);
    };
    PersonService.prototype.addPaginationToQuery = function (p) {
        var offset = (this.query.page - 1) * 5;
        var pagination = "&offset=" + offset.toString() + "&hits=5";
        this.query.searchQuery += pagination;
    };
    PersonService.prototype.executeQuery = function () {
        return this.http.get(this.query.searchQuery)
            .toPromise()
            .then(function (response) { return response.json().documentList.documents; })
            .catch(this.handleError);
    };
    PersonService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    return PersonService;
}());
PersonService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], PersonService);
exports.PersonService = PersonService;
//# sourceMappingURL=person-service.js.map