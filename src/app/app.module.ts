import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
import { AppComponent }  from './app.component';
import { PersonDetailComponent } from './person-detail.component';
import { HttpModule } from '@angular/http';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule ],
  declarations: [ AppComponent,
  PersonDetailComponent ],
  bootstrap:    [ AppComponent, ]
})
export class AppModule { }
