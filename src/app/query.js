"use strict";
var Query = (function () {
    function Query() {
        this.rawQuery = "";
        this.page = 1;
        this.searchQuery = "";
        this.hitsPerPage = 5;
        this.sorting = "Relevance";
    }
    return Query;
}());
exports.Query = Query;
//# sourceMappingURL=query.js.map