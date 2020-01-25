import { Component, OnInit } from "@angular/core";
import { Chore } from "src/app/models/chore.model";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TransactionInterface } from "src/app/models/transaction.model";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "src/app/services/message.service";

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
    selectedTab: number;

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
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {
        this.authService.currentUser$.subscribe(user => (this.user = user));
        this.getChoresList();
        this.selectedTab = +this.route.snapshot.queryParams.tab;
        if (!this.route.snapshot.queryParams.tab) {
            this.updateParams(0);
        }
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

    //method to update route params if it doesn't contain params
    //route should have params to provide good working tabs after click on them
    updateParams(tabIndex: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { tab: tabIndex }
        });
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
            let choreAction = $event.chore.isDonation ? "done" : "confirmed";

            this.apiService.confirmChore($event.chore._id).subscribe(
                res => {
                    this.messageService.sendMessage(
                        $event.chore.performer,
                        `${this.user.name} confirmed your chore.`,
                        choreAction
                    );
                    this.openSnackBar("Chore was confirmed", "close");
                },
                error => {
                    console.error(error.error);
                }
            );
        } else {
            this.apiService.rejectChore($event.chore._id).subscribe(
                res => {
                    this.messageService.sendMessage(
                        $event.chore.performer,
                        `${this.user.name} rejected your chore.`,
                        "rejected"
                    );
                    this.openSnackBar("Chore was rejected", "close");
                },
                error => {
                    console.log(error.error);
                }
            );
        }
    }

    setDone($event) {
        this.apiService.setChoreDone($event._id).subscribe(res => {
            this.messageService.sendMessage(
                $event.payer,
                `A chore is done by ${this.user.name}.`,
                "done"
            );
            this.openSnackBar("Chore is completed", "close");
        });
    }

    setPaid($event) {
        this.apiService.setChorePaid($event._id).subscribe(res => {
            this.messageService.sendMessage(
                $event.performer,
                `A chore is payed by ${this.user.name}.`,
                "paid"
            );
            this.openSnackBar("Chore is paid and archived", "close");
        });
    }

    createTransactionAfterPaid($event) {
        let transaction: TransactionInterface = {
            desc: $event.desc,
            amount: $event.cost,
            receiver: $event.performer
        };

        this.apiService.createTransaction(transaction).subscribe(
            res => {},
            error => {
                this.openSnackBar(error.error.error, "close");
            }
        );
    }
    onChorePayment($event) {
        this.setPaid($event);
        this.createTransactionAfterPaid($event);
    }

    openSnackBar(message: string, action: string) {
        this._snackBar
            .open(message, action, {
                duration: 1500
            })
            .afterDismissed()
            .subscribe(done => this.getChoresList());
    }
}
