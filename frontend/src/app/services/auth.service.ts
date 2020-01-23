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
        this.checkAuth();
        setInterval(() => {
            this.checkAuth();
        }, 60000);
    }

    public get currentUserValue(): User {
        return this.userSubject.value;
    }

    public checkAuth() {
        this.checkLogin()
            .pipe(first())
            .subscribe(data => {
                if (data) {
                    this.userSubject.next(data);
                    localStorage.setItem("user", JSON.stringify(data));
                } else {
                    localStorage.removeItem("user");
                    return false;
                }
            });
    }
    checkLogin() {
        let path = restPath + "/api/login";
        return this.http.get<User>(path, this.httpOptions).pipe(retry(2));
    }

    login(login: Login) {
        let path = restPath + "/api/login";
        return this.http
            .post<User>(path, JSON.stringify(login), this.httpOptions)
            .pipe(
                map(user => {
                    localStorage.setItem("user", JSON.stringify(user));
                    this.userSubject.next(user);
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
