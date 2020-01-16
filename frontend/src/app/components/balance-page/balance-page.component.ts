import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Transaction } from "src/app/models/transaction.model";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";

@Component({
    selector: "app-balance-page",
    templateUrl: "./balance-page.component.html",
    styleUrls: ["./balance-page.component.scss"]
})
export class BalancePageComponent implements OnInit {
    user: User;
    transactions: Transaction[] = [];
    isLoading: boolean;
    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {
        // this.authService.currentUser$.subscribe(user => {
        //     this.user = user;
        //     console.log(this.user);
        //     this.getTransactions();
        //     this.isLoading = false;
        // });
    }

    ngOnInit() {
        this.isLoading = true;
        this.authService.checkLogin().subscribe(user => {
            console.log(user, "user on Init");
            this.user = user;
            this.getTransactions();
            this.isLoading = false;
        });
    }

    getTransactions() {
        this.apiService.getTransactions().subscribe(
            data => {
                this.transactions = data;
                console.log(this.transactions);
            },
            error => {
                console.error(error);
            }
        );
    }
}
