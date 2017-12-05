import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client';


export class SocketService {

    connect() {
        let observable = new Observable(observer => {

            var socket = io();

            socket.on('user-joined', (data) => {
                observer.next(data);
            });

            socket.on('user-left', (data) => {
                observer.next(data);
            });

            return () => {
                socket.disconnect();
            };
        })

        return observable;
    }

}