import { Component } from '@angular/core';
import { Person } from './person';
import { PersonDetailComponent } from './person-detail.component';
import { FormsModule }   from '@angular/forms';
import { OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryService } from './query.service';
import { PersonService } from './person.service';
import { Query } from './query';


@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <form #f="ngForm" (ngSubmit)="search()" novalidate>
      <input name="first" [(ngModel)]="userInput" required #first="ngModel" placeholder = "Enter Search Query Here">
      <button>Submit</button>
    </form>

    <span *ngIf="numberOfHits != null" class="badge">Your Search Generated {{ numberOfHits }} hits.</span>

    <div *ngIf="spellSuggestions.length > 0" class="badge"> 
      <div> Did you perhaps intend to search for: </div>
      <ul>
        <li *ngFor="let suggestion of spellSuggestions" (click)="correctSpelling(suggestion)">
          <div> {{ suggestion }} </div>
        </li>
      </ul>
    </div>

    <div class="dropdown">
      <button class="dropbtn">Hits Per Page: {{ hitsPerPage }}</button>
      <div class="dropdown-content">
        <a (click)="updateHitsPerPage(5)">5</a>
        <a (click)="updateHitsPerPage(10)">10</a>
        <a (click)="updateHitsPerPage(15)">15</a>
        <a (click)="updateHitsPerPage(20)">20</a>
      </div>
    </div>

    <div class="dropdown">
      <button class="dropbtn">Sort By: {{ sorting }}</button>
      <div class="dropdown-content">
        <a (click)="changeSorting('Relevance')">Relevance</a>
        <a (click)="changeSorting('Name, Ascending')">Name, Ascending</a>
        <a (click)="changeSorting('Name, Descending')">Name, Descending</a>        
      </div>
    </div>

    <ul class="persons">
      <li *ngFor="let person of persons" (click)="onSelect(person)">
        <span class="badge">{{person.firstname}}</span> {{person.city}}        
      </li>      
      <person-detail [person]="selectedPerson"></person-detail>
    </ul>

    <li *ngFor="let page of pages" (click)="changePage(page)">
      <button class="badge">{{page}}</button>
    </li>
    `,    
    styleUrls: ['./app.component.css'],
    providers: [PersonService, QueryService, Query]
  })

export class AppComponent implements OnInit {

  constructor(
    private _personService: PersonService,
    private _queryService: QueryService) { }

  title = 'The Wise Finder';
  selectedPerson: Person;   
  persons: Person[];
  numberOfHits: number;
  pages: number[];
  numberOfPages: number;
  spellSuggestions: string[];
  userInput: string;
  hitsPerPage: number = 5;
  sorting: string = "Relevance";

  onSelect(person: Person): void{
    this.selectedPerson = person;
  }

  ngOnInit(): void {
    this.resetVars(); //(re)set some variables. This will always be called on a new search so it needs its own method
  }  

  resetVars(): void{
    this.pages = [];
    this.persons = [];
    this.numberOfHits = null;
    this.numberOfPages = null;
    this.selectedPerson = null;
    this.spellSuggestions = [];
    this.userInput = "";
    this._queryService.setPage(1);
    this._queryService.updateSearchQuery(this.userInput);    
  }

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
    this._queryService.updateSearchQuery(this.userInput); 
    console.log(this._queryService.getQuery());
    this.getAllData();
  }     

  changePage(n: number){
     this._queryService.setPage(n);
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

  updateHitsPerPage(n: number): void{
    this.hitsPerPage = n;
    this._queryService.setHitsPerPage(n); 
    if(this.persons.length > 0){      
      //only redo the search if we actually have some hits already. Otherwise we'll just set up the hitsperpage variable.
      this.search();
    }
  }

  correctSpelling(suggestion: string){
    this.resetVars();
    this.userInput = suggestion;
    this.search();
  }

  changeSorting(sortMethod: string){
    this.sorting = sortMethod;
    this._queryService.setSorting(this.sorting);
    if(this.persons.length > 0){    
      this.search();
    }
  }
}