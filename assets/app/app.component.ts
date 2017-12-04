import { Component } from '@angular/core';
import { ColabObject } from './Object/object.model';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
})
export class AppComponent {
    object : ColabObject = new ColabObject("This is some content.", false, "");
}