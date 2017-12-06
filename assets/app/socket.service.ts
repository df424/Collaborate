import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client';
import { Output, Injectable, EventEmitter } from "@angular/core";

Injectable()
export class SocketService {
    @Output() DataReceived = new EventEmitter<string>();

    connect() {
        let observable = new Observable(observer => {

            var socket = io();

            socket.on('data', (data) => {
                observer.next(data);
            });

            return () => {
                socket.disconnect();
            };
        })

        return observable;
    }

}