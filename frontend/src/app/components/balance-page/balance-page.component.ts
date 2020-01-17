import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Transaction } from "src/app/models/transaction.model";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";
import { Chore } from "src/app/models/chore.model";

@Component({
    selector: "app-balance-page",
    templateUrl: "./balance-page.component.html",
    styleUrls: ["./balance-page.component.scss"]
})
export class BalancePageComponent implements OnInit {
    user: User;
    transactions: Transaction[] = [];
    isLoading: boolean;
    calculations = {};
    choresList: Chore[];
    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.isLoading = true;
        this.authService.checkLogin().subscribe(user => {
            this.user = user;
            this.getTransactions();
            this.getChores();
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

    getChores() {
        this.apiService.getChoresList().subscribe(
            data => {
                let keys = Object.keys(data);
                this.choresList = data[keys[0]];
                console.log(this.choresList, "chore list");
                this.calculations = {
                    ...this.calculateChores(this.choresList)
                };
                console.log(this.calculations, "calculated");
            },
            error => {
                console.error(error);
            }
        );
    }

    calculateChores(data: Chore[]) {
        let result = { isPaid: 0, toPay: 0, isDoing: 0 };
        data.forEach(item => {
            if (item.isPaid) {
                result.isPaid += item.cost;
            }
            if (!item.isPaid && item.isConfirmed) {
                result.toPay += item.cost;
            }
            if (!item.isDone && item.isConfirmed) {
                result.isDoing += item.cost;
            }
        });
        return result;
    }
}
