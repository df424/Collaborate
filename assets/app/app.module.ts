import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";
import { ObjectComponent } from './Object/object.component';
import { HttpModule } from '@angular/http';

@NgModule({
    declarations: [
        AppComponent,
        ObjectComponent
    ],
    imports: [BrowserModule, FormsModule, HttpModule],
    bootstrap: [AppComponent]
})
export class AppModule {

}