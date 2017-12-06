import { ColabObject } from './object.model';
import { Http, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ObjectService {
    private objects : ColabObject[] = [];

    constructor(private http: Http) {}

    addObject(object: ColabObject) {
        const body = JSON.stringify(object);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/create_obj', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    deleteObject(object: ColabObject) {
        const body = JSON.stringify(object);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.delete('http://localhost:3000/')
    }
}