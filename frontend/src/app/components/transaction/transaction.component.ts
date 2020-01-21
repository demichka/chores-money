import { Component, OnInit, Input } from "@angular/core";
import { Transaction } from "src/app/models/transaction.model";

@Component({
    selector: "app-transaction",
    templateUrl: "./transaction.component.html",
    styleUrls: ["./transaction.component.scss"]
})
export class TransactionComponent implements OnInit {
    @Input() item: Transaction;
    constructor() {}

    ngOnInit() {}
}
