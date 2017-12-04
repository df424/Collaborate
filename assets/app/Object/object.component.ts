import { ColabObject } from './object.model';
import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-object',
    templateUrl: './object.component.html'
})
export class ObjectComponent {
    @Input() object : ColabObject;

    onEdit() {
        alert("It worked!");
    }

    onDelete()
    {
        alert("It worked!");
    }
}