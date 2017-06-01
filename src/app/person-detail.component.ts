import { Component, Input } from '@angular/core';
import { Person } from './person';

@Component({
  selector: 'person-detail',
  template: `
    <div *ngIf="person">
      <h2>{{person.name}}</h2>
      <div><label>city: </label>{{person.city}}</div>
      <div><label>email: </label>{{person.email}}</div>
    </div>
  `,
})

export class PersonDetailComponent {
  @Input() person: Person;
}