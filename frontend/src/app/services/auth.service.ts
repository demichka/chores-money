import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Login } from "../models/login.model";
import { map, first } from "rxjs/operators";
import { restPath } from "../../../../config/path.config";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private userSubject: BehaviorSubject<User>;
    public currentUser$: Observable<User>;
    user: User;

    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        }),
        withCredentials: true
    };

    constructor(private http: HttpClient) {
        this.userSubject = new BehaviorSubject<User>(this.user);
        this.currentUser$ = this.userSubject.asObservable();
        this.checkLogin()
            .pipe(first())
            .subscribe(data => {
                if (data) {
                    this.userSubject.next(data);
                    return data;
                } else {
                    return false;
                }
            });
    }

    public get currentUserValue(): User {
        return this.userSubject.value;
    }

    checkLogin() {
        let path = restPath + "/api/login";
        return this.http.get<User>(path, this.httpOptions).pipe(
            map(data => {
                return data;
            })
        );
    }

    login(login: Login) {
        let path = restPath + "/api/login";
        return this.http
            .post<User>(path, JSON.stringify(login), this.httpOptions)
            .pipe(
                map(user => {
                    if (user) {
                        this.user = user;
                        this.userSubject.next(this.user);
                    }
                    return user;
                })
            );
    }

    logout() {
        let path = restPath + "/api/logout";
        return this.http
            .get(path, { withCredentials: true })
            .pipe(map(res => this.userSubject.next(null)));
    }
}
