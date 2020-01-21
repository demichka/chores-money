import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { User } from "src/app/models/user.model";
import { ApiService } from "src/app/services/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/services/auth.service";

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

    constructor(
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private authService: AuthService
    ) {
        this.author = authService.currentUserValue;
    }

    ngOnInit() {}

    onSubmit() {
        if (this.transactionForm.invalid) {
            throw "Form is invalid";
        }
        if (this.desc.value == "") {
            this.desc.setValue("Transaction");
        }

        let transaction = {
            ...this.transactionForm.value
            // receiver: this.author._id
        };
        this.apiService.createTransaction(transaction).subscribe(
            res => {
                this._snackBar.open(
                    `Your account is debited with ${this.amount.value} SEK`,
                    "close"
                );
                this._snackBar._openedSnackBarRef
                    .afterOpened()
                    .subscribe(res => {
                        this.resetForm();
                    });
            },
            error => {
                this._snackBar.open(error.error.error, "close");
            }
        );
    }

    //to prevent errors in required input after reset form, this feature is not supported properly by Angular Material team
    resetForm() {
        this.transactionForm.reset();
        this.desc.setErrors(null);
        this.amount.setErrors(null);
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

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 5000
        });
    }
}
