import { SocketService } from './socket.service';
import { Component } from '@angular/core';
import { ColabObject } from './Object/object.model';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [SocketService]
})
export class AppComponent {
    object : ColabObject = new ColabObject("This is some content.", false, "");

    constructor(private socketService: SocketService){
        socketService.connect().subscribe (
            data => console.log(data),
            error => console.error(error),
        );
    }
}