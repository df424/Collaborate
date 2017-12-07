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
        this.objectService.lockObject(this.object).subscribe(
            (data) => {
                console.log(data);
                this.object.inUseByMe = true;
            },
            error => console.error(error),
        )
    }

    onDelete()
    {
        console.log("Passing in: " + this.object.objectId + " to delete function.");
        this.objectService.deleteObject(this.object).subscribe(
            data => console.log(data),
            error => console.error(error),
        )       
    }

    onLostFocus() {
        // TODO: submit final changes and unlock object.
        this.object.inUseByMe = false;

        this.objectService.unlockObject(this.object).subscribe(
            data => console.log(data),
            error => console.error(error),
        );
    }

    OnValueChanged(change) {
        this.object.content = change;

        console.log("Content is now: " + this.object.content);

        // update model so server can push to other clients.
        this.objectService.updateObject(this.object).subscribe(
            data => console.log(data),
            error => console.error(error),
        );
    }
}