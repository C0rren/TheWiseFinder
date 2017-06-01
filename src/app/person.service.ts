import 'rxjs/add/operator/toPromise';
import { Injectable }    from '@angular/core';
import { Query } from './query';
import { HttpModule } from '@angular/http';
import { Http  } from '@angular/http';
import { Person } from './person';

@Injectable()
export class PersonService {
  
  constructor(private http: Http) {}  

  getAllData(query: string): Promise<any>{
    return this.http.get(query)
          .toPromise()
          .then(response => response.json())
          .catch(this.handleError);
  }

  getPersons(query: string): Promise<Person[]>{ 
      return this.http.get(query)
          .toPromise()
          .then(response => response.json().documentList.documents as Person[])
          .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }  

}