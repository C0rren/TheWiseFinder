import { Component } from '@angular/core';
import { Person } from './person';
import { FormsModule }   from '@angular/forms';
import { NgForm } from '@angular/forms';
import { QueryService } from './query.service';
import { PersonService } from './person.service';
import { Query } from './query';


@Component({
  selector: 'my-app',
  template: `
    <div class="container">
      <div class="main">
        <section class="header">
          <h1 class = "title">{{title}}</h1>
        </section>

        <div class="row padded">
          <div class="three columns">
            <label for="sortingSelect">Sort By: </label>
            <select class="form-control" required [(ngModel)]="sorting" class="u-full-width" (change)="updatedSorting()">
              <option *ngFor="let sort of sortingChoices" [ngValue]="sort">{{sort}}</option>
            </select>
          </div>

          <div class="three columns">
            <label for="hitsPerPageSelect">Hits Per Page: </label>
            <select class="form-control" required [(ngModel)]="hitsPerPage" class="u-full-width" (change)="updatedHitsPerPage()">
              <option *ngFor="let num of numberOfHitsChoices" [ngValue]="num">{{num}}</option>
            </select>
          </div>
        </div> 

        <form class = "padded" #f="ngForm" (ngSubmit)="search()" novalidate>
          <div class="row">
            <div class="twelve columns">
              <input id = "mainSearchWindow" class="u-full-width form-control" type="text" name="first" [(ngModel)]="userInput" required placeholder = "Search" >
            </div>
          </div>        
        </form>    

        <div class = "row" id = "numberOfResults">
          <div class = "twelve columns" *ngIf="numberOfHits != null">Your Search Generated <b>{{ numberOfHits }}</b> hits.</div>
        </div>

        <div *ngIf="spellSuggestions.length > 0" class="row padded"> 
          <div class = "twelve columns"> Did you perhaps intend to search for: 
            <div *ngFor="let suggestion of spellSuggestions" (click)="correctSpelling(suggestion)">
              <a><b>{{ suggestion }}</b></a>
            </div>
          </div>
        </div>     

        <ng-container *ngFor = "let person of persons; let i = index" class="row">
          <ng-container *ngIf = "i % 2 === 0">
            <div class = "row padded personRow">
              <ng-container *ngFor = "let j of [0,1]">
                <div *ngIf = "persons[i+j] != undefined" class = "six columns personDiv">
                  {{persons[i+j].firstname + " " + persons[i+j].lastname}}<br>                 
                  {{persons[i+j].phone}}<br>
                  {{persons[i+j].email}}
                </div> 
              </ng-container> 
            </div>
          </ng-container>            
        </ng-container> 

      </div>  
    </div>

    <div class="container searchContainer">      
      <div class="row Aligner" *ngIf="pages.length > 1">
        <div class = "one column Aligner-item page" id="pagesLabel">Page: </div>
        <div class = "one column Aligner-item" *ngFor="let page of pages" (click)="changePage(page)">
          <a [ngClass]="{'bolded': page === currentPage}" class="pageChange page">{{page}}</a>
        </div>
      </div>         
    </div>

    `,    
    styleUrls: ['./app.component.css'],
    providers: [PersonService, QueryService, Query]
  })

export class AppComponent{

  constructor(
    private _personService: PersonService,
    private _queryService: QueryService) { }

  title = 'The Wise Finder';
  persons: Person[];
  numberOfHits: number = null;
  pages: number[] = [];
  numberOfPages: number = null;
  spellSuggestions: string[] = [];
  userInput: string = "";
  hitsPerPage: number = 5;
  sorting: string = "Relevance";
  numberOfHitsChoices = [5,10,15,20];
  sortingChoices = ["Relevance", "Name, Ascending", "Name, Descending"];
  currentPage: number = 1;

  getAllData(): void{
    this._personService
      .getAllData(this._queryService.getQuery())
      .then((response) => {
        this.persons = response.documentList.documents as Person[];
        //this.totalPages = response.documentList.pagination.pages.length as number;
        this.numberOfHits = response.stats.totalHits as number;
        this.numberOfPages = response.documentList.pagination.pages.length as number;
        this.generatePages(response.documentList.pagination.pages.length as number);
        this.spellSuggestions = response.spell.suggestions as string[];
      });
  }

  search(): void{
    //this is called when the user performs a fresh/new search, we will always want to start on page 1 so only the search query itself is needed.
    event.preventDefault();
    //ask the personService to perform the API query
    this._queryService.setPage(1);
    this._queryService.setHitsPerPage(this.hitsPerPage); 
    this._queryService.updateSearchQuery(this.userInput);     
    this.getAllData();
  }     

  changePage(n: number){
     this.currentPage = n;
     this._queryService.setPage(this.currentPage);
     this.getPersons(); // Need to do a new query now since we switched page.
  }

  nextPage(): void{
    //this._queryService.setPage(this._queryService.getPage()+1);
    this.changePage(this._queryService.getPage() + 1);
  }

  getPersons(): void{
    this._personService
      .getPersons(this._queryService.getQuery())
      .then((response) => {
        this.persons = response;
      });
  }  

  generatePages(n: number): void{    
    this.pages = []; //clear the array when making a new search! Remember this needs to be called when changing the number of hits per page too, so it should be in this method
    for(let i = 0; i < n; i++){
      this.pages[i] = i+1; 
    }   
  }  

  correctSpelling(suggestion: string){
    this.userInput = suggestion;
    this.search();
  }

  updatedHitsPerPage(): void{
    //this.hitsPerPage is bound with ngModel from the select, this is just to let the queryservice know we want a new query with the updated hits per page.  
    if(this.persons.length > 0){      
      //only redo the search if we actually have some hits already. Otherwise we'll just set up the hitsperpage variable.
      this.search();
    }
  }

  updatedSorting(){
    //this.sorting is bound with ngModel from the select, this is just to let the queryservice know we want a new query with the updated sorting.    
    this._queryService.setSorting(this.sorting);
    if(this.persons.length > 0){    
      this.search();
    }
  }
}