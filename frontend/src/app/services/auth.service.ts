import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { User } from "../models/user.model";
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse
} from "@angular/common/http";
import { Login } from "../models/login.model";
import { retry } from "rxjs/operators";
import { restPath } from "../../../../config/keys";

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

    constructor(private http: HttpClient) {}

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error("An error occured:", error.error.message);
        } else {
            const { errorCode } = error.error;
            console.error(
                `Error status: ${error.status}, body: ${
                    errorCode ? errorCode : error.error
                }`
            );
        }
        return throwError("Error occured. Please try later");
    }

    public checkLogin(): Observable<any> {
        let path = restPath + "/api/check-login";
        return this.http.get(path, this.httpOptions).pipe(retry(2));
    }

    login(login: Login) {
        let path = restPath + "/api/login";
        return this.http
            .post<User>(path, JSON.stringify(login), this.httpOptions)
            .pipe(retry(1));
    }

    logout() {
        let path = restPath + "/api/logout";
        return this.http.get(path, { withCredentials: true });
    }
}
