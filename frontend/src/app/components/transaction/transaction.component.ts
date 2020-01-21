import { Component, OnInit, Input } from "@angular/core";
import { Transaction } from "src/app/models/transaction.model";
import { AuthService } from "src/app/services/auth.service";

@Component({
    selector: "app-transaction",
    templateUrl: "./transaction.component.html",
    styleUrls: ["./transaction.component.scss"]
})
export class TransactionComponent implements OnInit {
    @Input() item: Transaction;
    currency: string;
    constructor(private authService: AuthService) {
        this.currency = this.authService.currentUserValue.currency;
    }

    ngOnInit() {}
}
