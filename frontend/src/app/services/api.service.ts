import { Injectable } from "@angular/core";
import { restPath } from "../../../../config/path.config";
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse
} from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { User, UserInterface } from "../models/user.model";
import { retry, catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class ApiService {
    constructor(private http: HttpClient) {}

    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        }),
        withCredentials: true
    };

    //handle Api errors
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

    //register new account
    registerAccount(user): Observable<any> {
        return this.http
            .post<UserInterface>(
                restPath + "/api/register",
                JSON.stringify(user),
                this.httpOptions
            )
            .pipe(retry(2));
    }
}
