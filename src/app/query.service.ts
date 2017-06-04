import 'rxjs/add/operator/toPromise';
import { Injectable }    from '@angular/core';
import { Query } from './query';
import { Person } from './person';

@Injectable()
export class QueryService{
  
  private _APIURL = 'http://search.i3demo.findwise.com/rest/apps/demo/searchers/programming_assinment?';
  private _query = new Query();

  updateSearchQuery(rawInput: string){
    this.setRawQuery(rawInput);
    this.fromRawToQuery(rawInput);  
    this.addPaginationToQuery(this.getPage());  
    this.addSortingToQuery(this.getSorting());
  }

  setPage(p: number){
    this._query.page = p;
    this.updateSearchQuery(this._query.rawQuery); // We need to rebuild the query string. This is easier than removing the pagination part of the string and remaking it.
  }

  getPage(): number{
    return this._query.page;
  }

  setRawQuery(s: string){
    this._query.rawQuery = s;
  }

  getRawQuery(): string{
    return this._query.rawQuery;
  }

  setHitsPerPage(n: number){
    this._query.hitsPerPage = n;
  }

  fromRawToQuery(r: string){
    r = r.replace(/\s+/g, "+")
    r = this._APIURL + "q=" + r;      
    this._query.searchQuery = r;   
  }

  addPaginationToQuery(p: number){
    let offset: number = (p - 1) * 5;
    let pagination: string = "&offset=" + offset.toString() + "&hits=" + this._query.hitsPerPage.toString();
    this._query.searchQuery += pagination;
  }

  addSortingToQuery(s: string){
    let sorting: string = "&sort=" + s;
    this._query.searchQuery += sorting;
  }

  getQuery(){
    return this._query.searchQuery;
  }

  setSorting(s: string){
    this._query.sorting = s;
  }

  getSorting(): string{
    if(this._query.sorting === "Relevance"){
      return "name.score";
    }
    else if(this._query.sorting === "Name, Ascending"){
      return "name.asc";
    }
    else if(this._query.sorting === "Name, Descending"){
      return "name.desc"
    }
    else{
      //not really required but might be good for future security
      return "name.score";
    }
  }
}