import { Component, OnInit } from "@angular/core";
import { Chore } from "src/app/models/chore.model";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TransactionInterface } from "src/app/models/transaction.model";

@Component({
    selector: "app-chores-list",
    templateUrl: "./chores-list.component.html",
    styleUrls: ["./chores-list.component.scss"]
})
export class ChoresListComponent implements OnInit {
    choresList: { data: Chore[] };
    errors: { error: "" };
    isLoading: boolean;
    user: User;
    private _filteredChores: {
        doneNotPaidChores: Chore[];
        choresToConfirm: Chore[];
        archivedChores: Chore[];
        toDo: Chore[];
    };

    public set filteredChores(value: {
        doneNotPaidChores: Chore[];
        choresToConfirm: Chore[];
        archivedChores: Chore[];
        toDo: Chore[];
    }) {
        this._filteredChores = value;
    }
    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        private _snackBar: MatSnackBar
    ) {
        this.authService.currentUser$.subscribe(user => (this.user = user));
        this.getChoresList();
    }

    ngOnInit() {}

    getChoresList() {
        this.isLoading = true;
        this.apiService.getChoresList().subscribe(
            data => {
                this.choresList = data;
                this.filterChores();
                this.isLoading = false;
            },
            error => {
                this.errors.error = error.error;
                this._snackBar.open(this.errors.error, "close");
            }
        );
    }

    filterChores() {
        let keys = Object.keys(this.choresList);
        const toDo = this.choresList[keys[0]].filter(
            item => item.isConfirmed && !item.isPaid && !item.isDone
        );
        const doneNotPaidChores = this.choresList[keys[0]].filter(
            item => item.isDone && !item.isPaid
        );

        const choresToConfirm = this.choresList[keys[0]].filter(
            item => !item.isDone && !item.isConfirmed
        );

        const archivedChores = this.choresList[keys[0]].filter(
            item => item.isPaid
        );
        this.filteredChores = {
            doneNotPaidChores,
            choresToConfirm,
            archivedChores,
            toDo
        };
    }

    onChoreReview($event) {
        if ($event.confirm) {
            this.apiService.confirmChore($event.chore).subscribe(
                res => {
                    this.getChoresList();
                    this._snackBar.open("Chore was confirmed", "close");
                },
                error => {
                    console.error(error.error);
                }
            );
        } else {
            this.apiService.rejectChore($event.chore).subscribe(
                res => {
                    this.getChoresList();
                    this._snackBar.open("Chore was rejected", "close");
                },
                error => {
                    console.log(error.error);
                }
            );
        }
    }

    setDone($event) {
        this.apiService.setChoreDone($event).subscribe(res => {
            this.getChoresList();
            this._snackBar.open("Chore is completed", "close");
        });
    }

    setPaid($event) {
        this.apiService.setChorePaid($event._id).subscribe(res => {
            this.getChoresList();
            this._snackBar.open("Chore is paid and archived", "close");
        });
    }

    createTransactionAfterPaid($event) {
        let transaction: TransactionInterface = {
            desc: $event.desc,
            amount: $event.cost,
            receiver: $event.performer
        };

        console.log(this.user.isParent, "isparent");

        // this.user.isParent
        //     ? null
        //     : (transaction.receiver = $event.chore.performer);

        console.log(transaction, "transaction");
        this.apiService.createTransaction(transaction).subscribe(
            res => {
                this._snackBar.open("Transaction is created", "close");
            },
            error => {
                this._snackBar.open(error.error.error, "close");
            }
        );
    }
    onChorePayment($event) {
        this.setPaid($event);
        this.createTransactionAfterPaid($event);
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 5000
        });
    }
}
