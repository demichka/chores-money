import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { restPath } from "../../../config/keys.dev";
import { map, retry } from "rxjs/operators";
import { User } from "./models/user.model";

@Injectable({
    providedIn: "root"
})
export class UserService {
    currentUser$: Observable<User>;
    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        }),
        withCredentials: true
    };
    constructor(private http: HttpClient) {
        this.currentUser$ = this.getUser().pipe(
            map(user => {
                return user;
            })
        );
    }

    getUser(): Observable<any> {
        return this.http
            .get<any>(restPath + "/api/get-user", this.httpOptions)
            .pipe(retry(2));
    }
}
