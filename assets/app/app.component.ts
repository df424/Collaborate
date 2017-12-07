import { ObjectService } from './Object/object.service';
import { SocketService } from './socket.service';
import { Component } from '@angular/core';
import { ColabObject } from './Object/object.model';
import { Object } from 'core-js/library/web/timers';
import { OnInit } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [SocketService, ObjectService],
    styles: [`
        .author {
            display: inline-block;
            font-style: italic;
            font-size: 12px;
            width: 80%;
        }

        .config {
            display: inline-block;
            text-align: right;
            font-size: 12px;
            width: 19%;
        }
    `]
})
export class AppComponent implements OnInit {
    objects: ColabObject[];
    user_name: string;

    constructor(private socketService: SocketService, private objectService: ObjectService) {

        socketService.connect().subscribe (
            (data: any) => {
                console.log(data);

                if(data.event == 'whole-document') {
                    // Empty the array.
                    this.objects = []

                    // Then fill it back up.
                    for(let object of data.data) {
                        console.log(object);
                        this.objects.push(new ColabObject(
                            object.content, object.in_use, object._id
                        ));
                    }
                } 
                else if(data.event == 'new-object') {
                    console.log("Server pushed new object: " + data.data);

                    this.objects.push(new ColabObject( data.data.content, data.data.in_use, data.data._id ));
                } 
                else if(data.event == 'del-object') {
                    console.log("Server issued command to delete object: " + data.data);

                    let obj = this.objects.find((x) => x.objectId == data.data._id);

                    if(obj){
                        console.log("Found matching object with ID:" + obj.objectId + ".  Removing...");
                        this.objects.splice(this.objects.indexOf(obj), 1);
                    }
                }
                else if(data.event == 'update-object')
                {
                    console.log("Server issued command to update object: " + data.data._id);

                    let obj = this.objects.find((x) => x.objectId == data.data._id);

                    if(obj) {
                        console.log("Updating content: " + data.data.content);
                        obj.content = data.data.content;
                    }
                }
                else if(data.event == 'lock-object')
                {
                    console.log("Server issued command to lock object: " + data.data)
                    let obj = this.objects.find( (x) =>  x.objectId == data.data.id);

                    if(obj)
                    {
                        obj.in_use = true;
                    }
                }
                else if(data.event == 'unlock-object')
                {
                    console.log("Server issued command to unlock object: " + data.data)
                    let obj = this.objects.find( (x) =>  x.objectId == data.data.id);

                    if(obj)
                    {
                        obj.in_use = false;
                    }
                }
                else if(data.event == 'user-name')
                {
                    this.user_name = data.data;
                }
            },
            error => console.error(error),
        );
    }

    onNewObject()
    {
        const object = new ColabObject("New Object!", false);
        this.objectService.addObject(object).subscribe(
            data => console.log(data),
            error => console.error(error),
        )
    }

    ngOnInit(): void {
        //this.objects = this.objectService.getObjects();
    }
}