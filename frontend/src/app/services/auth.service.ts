import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Login } from "../models/login.model";
import { map } from "rxjs/operators";
import devkeys from "../../../../config/path.config";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    user: User;

    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
    };

    constructor(private http: HttpClient) {}

    login(login: Login) {
        let path = devkeys.restPath + "/api/login";
        return this.http
            .post<User>(path, JSON.stringify(login), this.httpOptions)
            .pipe(
                map(user => {
                    if (user) {
                        this.user = user;
                        return this.user;
                        console.log(this.user);
                    }
                })
            );
    }
}
