import { ObjectService } from './object.service';
import { SocketService } from '../socket.service';
import { ColabObject } from './object.model';
import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-object',
    templateUrl: './object.component.html',
})
export class ObjectComponent {
    @Input() object : ColabObject;

    constructor(private objectService: ObjectService) {}

    onEdit() {
        alert("It worked!");
    }

    onDelete()
    {
        this.objectService.deleteObject(this.object);        
    }
}