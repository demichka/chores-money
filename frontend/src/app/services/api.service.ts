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
import { ChoreInterface } from "../models/chore.model";
import { TransactionInterface } from "../models/transaction.model";

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

    //register new account for a child

    registerChildAccount(user): Observable<any> {
        return this.http
            .post<UserInterface>(
                restPath + "/api/register-child",
                JSON.stringify(user),
                this.httpOptions
            )
            .pipe(retry(2));
    }

    //add a child from existed users
    addChild(data): Observable<any> {
        return this.http
            .post<any>(
                restPath + "/api/add-child",
                JSON.stringify(data),
                this.httpOptions
            )
            .pipe(retry(2));
    }

    //get children list

    getChildrenList(): Observable<any> {
        return this.http
            .get<any>(restPath + "/api/my-children", this.httpOptions)
            .pipe(retry(2));
    }

    //add a chore
    addChore(data): Observable<any> {
        return this.http
            .post<ChoreInterface>(
                restPath + "/api/create-chore",
                JSON.stringify(data),
                this.httpOptions
            )
            .pipe(retry(1));
    }

    //get a chore by id

    getChoreById(id: string): Observable<any> {
        return this.http
            .get(restPath + "/api/chore/" + id, this.httpOptions)
            .pipe(retry(2));
    }

    //edit a chore
    updateChore(id: string, data): Observable<any> {
        return this.http
            .put(
                restPath + "/api/edit-chore/" + id,
                JSON.stringify(data),
                this.httpOptions
            )
            .pipe(retry(1));
    }

    //get parents list
    getParentsList(): Observable<any> {
        return this.http
            .get<any>(restPath + "/api/my-parents", this.httpOptions)
            .pipe(retry(2));
    }

    //get chores list
    getChoresList(): Observable<any> {
        return this.http
            .get<any>(restPath + "/api/my-chores", this.httpOptions)
            .pipe(retry(2));
    }

    //confirm a chore
    confirmChore(id): Observable<any> {
        return this.http
            .put<any>(
                restPath + "/api/confirm-chore/" + id,
                { isConfirmed: true },
                this.httpOptions
            )
            .pipe(retry(1));
    }

    //reject a chore
    rejectChore(id): Observable<any> {
        return this.http
            .delete<any>(restPath + "/api/reject-chore/" + id, this.httpOptions)
            .pipe(retry(1));
    }

    //set a chore as Done
    setChoreDone(id): Observable<any> {
        return this.http
            .put<any>(
                restPath + "/api/set-chore-done/" + id,
                { isDone: true },
                this.httpOptions
            )
            .pipe(retry(1));
    }

    //set a chore as Paid
    setChorePaid(id: string): Observable<any> {
        return this.http
            .put<any>(
                restPath + "/api/set-chore-paid/" + id,
                { isPaid: true },
                this.httpOptions
            )
            .pipe(retry(1));
    }

    //create transaction
    createTransaction(data: any): Observable<any> {
        return this.http
            .post<TransactionInterface>(
                restPath + "/api/create-transaction",
                JSON.stringify(data),
                this.httpOptions
            )
            .pipe(retry(1));
    }

    //get transactions
    getTransactions(): Observable<any> {
        return this.http
            .get<any>(restPath + "/api/my-transactions", this.httpOptions)
            .pipe(retry(1));
    }

    //update user profile
    updateProfile(data: any): Observable<any> {
        return this.http
            .patch<UserInterface>(
                restPath + "/api/update-profile",
                JSON.stringify(data),
                this.httpOptions
            )
            .pipe(retry(1));
    }

    //create a message
    createMessage(data: any): Observable<any> {
        return this.http
            .post(
                restPath + "/api/create-message",
                JSON.stringify(data),
                this.httpOptions
            )
            .pipe(retry(1));
    }

    //get messages
    getMessages(): Observable<any> {
        return this.http
            .get(restPath + "/api/my-messages", this.httpOptions)
            .pipe(retry(2));
    }

    //read message
    readMessage(id: string): Observable<any> {
        return this.http.get(
            restPath + "/api/read-message/" + id,
            this.httpOptions
        );
    }

    //remove message
    removeMessage(id: string): Observable<any> {
        return this.http.delete(
            restPath + "/api/remove-message/" + id,
            this.httpOptions
        );
    }

    //forgot your password on login page

    resetPassword(email: string): Observable<any> {
        return this.http
            .post(
                restPath + "/api/reset-password",
                JSON.stringify({ email: email }),
                this.httpOptions
            )
            .pipe();
    }
}
