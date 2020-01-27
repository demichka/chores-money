import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Login } from "../models/login.model";
import { map, first, retry } from "rxjs/operators";
import { restPath } from "../../../../config/path.config";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    user: User;

    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        }),
        withCredentials: true,
        Accept: "application/json"
    };

    constructor(private http: HttpClient) {
        // this.checkAuth();
        // setInterval(() => {
        //     this.checkAuth();
        // }, 60000);
    }

    public checkAuth() {
        this.checkLogin()
            .pipe(first())
            .subscribe(res => {
                if (res) {
                    console.log(res);
                } else {
                    console.error(res);
                }
            });
    }
    public checkLogin(): Observable<any> {
        let path = restPath + "/api/check-login";
        return this.http.get<User>(path, this.httpOptions).pipe();
    }

    login(login: Login) {
        let path = restPath + "/api/login";
        return this.http
            .post<User>(path, JSON.stringify(login), this.httpOptions)
            .pipe();
    }

    logout() {
        let path = restPath + "/api/logout";
        return this.http.get(path, { withCredentials: true });
    }
}
