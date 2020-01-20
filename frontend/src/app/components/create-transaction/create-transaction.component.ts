import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { User } from "src/app/models/user.model";
import { ApiService } from "src/app/services/api.service";

@Component({
    selector: "app-create-transaction",
    templateUrl: "./create-transaction.component.html",
    styleUrls: ["./create-transaction.component.scss"]
})
export class CreateTransactionComponent implements OnInit {
    amount = new FormControl("", [Validators.required, Validators.min(1)]);
    desc = new FormControl("", [Validators.maxLength(50)]);
    author: User;
    transactionForm = new FormGroup({
        amount: this.amount,
        desc: this.desc
    });

    constructor(private apiService: ApiService) {}

    ngOnInit() {}

    onSubmit() {
        if (this.transactionForm.invalid) {
            throw "Form is invalid";
        }
        if (this.desc.value == "") {
            this.desc.setValue("Transaction");
        }
        this.apiService.createTransaction(this.transactionForm.value).subscribe(
            res => {
                console.log(res);
                this.resetForm();
            },
            error => {
                console.error(error);
            }
        );
    }

    //to prevent errors in required input after reset form, this feature is not supported properly by Angular Material team
    resetForm() {
        this.transactionForm.reset();
        this.desc.setErrors(null);
        this.amount.setErrors(null);
        s;
    }

    getErrorMessageDesc() {
        return this.desc.hasError("maxlength")
            ? "Max length 50 characters"
            : "";
    }
    getErrorMessageAmount() {
        return this.amount.hasError("required")
            ? "You must enter a value"
            : this.amount.hasError("min")
            ? "Amount must be more than 0"
            : "";
    }
}
