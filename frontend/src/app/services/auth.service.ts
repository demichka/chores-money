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
        withCredentials: true,
        Accept: "application/json"
    };

    constructor(private http: HttpClient) {
        this.userSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem("user")) || null
        );
        this.currentUser$ = this.userSubject.asObservable();
        this.checkLogin()
            .pipe(first())
            .subscribe(data => {
                if (data) {
                    this.userSubject.next(data);
                    localStorage.setItem("user", JSON.stringify(data));
                    console.log(data, "data from auth");
                } else {
                    localStorage.removeItem("user");
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
                console.log(data, "data, auth check");
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
                        localStorage.setItem("user", JSON.stringify(user));
                        this.userSubject.next(user);
                    }
                })
            );
    }

    logout() {
        let path = restPath + "/api/logout";
        localStorage.removeItem("user");
        return this.http
            .get(path, { withCredentials: true })
            .pipe(map(res => this.userSubject.next(null)));
    }
}
