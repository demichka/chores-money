import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Transaction } from "src/app/models/transaction.model";
import { User } from "src/app/models/user.model";
import { Chore } from "src/app/models/chore.model";
import { FormatMinusValue } from "src/app/helpers/formatMinusValue.pipe";
import { UserService } from "src/app/user.service";

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
    constructor(
        private apiService: ApiService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.isLoading = true;
        this.userService.getUser().subscribe(user => {
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
            },
            error => {
                console.error(error);
            }
        );
    }

    getChores() {
        this.apiService.getChoresList().subscribe(
            data => {
                if (!data.data) {
                    throw "No data returned";
                }
                this.calculations = {
                    ...this.calculateChores(data.data)
                };
            },
            error => {
                console.error(error);
            }
        );
    }

    calculateChores(data: Chore[]) {
        let result = { toPay: 0, isDoing: 0 };
        if (!data.length) {
            return result;
        }
        data.forEach(item => {
            if (!item.isPaid && item.isConfirmed && item.isDone) {
                result.toPay += item.cost;
            }
            if (!item.isDone && item.isConfirmed) {
                result.isDoing += item.cost;
            }
        });
        return result;
    }
}
