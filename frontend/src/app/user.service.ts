import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { restPath } from "../../../config/keys.dev";
import { AuthService } from "./services/auth.service";

@Injectable({
    providedIn: "root"
})
export class UserService {
    currentUser;
    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        }),
        withCredentials: true
    };
    constructor(private http: HttpClient, private authService: AuthService) {}

    // public getCurrentUser() {
    // 	this.authService.checkLogin
    // }

    getUser(): Observable<any> {
        return this.http
            .get(restPath + "/api/get-user", this.httpOptions)
            .pipe();
    }
}
