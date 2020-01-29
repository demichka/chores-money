import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { restPath } from "../../../../config/keys";
import { skipWhile } from "rxjs/operators";
import { User } from "../models/user.model";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private subject: Subject<User> = new BehaviorSubject(null as User);

    public currentUser$: Observable<User> = this.subject
        .asObservable()
        .pipe(skipWhile(x => !x));

    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        }),
        withCredentials: true
    };

    constructor(private http: HttpClient) {
        this.reloadUser();
    }

    public reloadUser() {
        this.fetchUser().subscribe((data: User) => {
            this.subject.next(data);
        });
    }

    public removeCurrentUser() {
        this.subject.next(null as User);
    }

    private fetchUser() {
        return this.http.get<any>(restPath + "/api/get-user", this.httpOptions);
    }
}
