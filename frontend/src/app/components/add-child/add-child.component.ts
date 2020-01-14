import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";

@Component({
    selector: "app-add-child",
    templateUrl: "./add-child.component.html",
    styleUrls: ["./add-child.component.scss"]
})
export class AddChildComponent implements OnInit {
    phone = new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(5),
        Validators.pattern("^[0-9]*$")
    ]);
    errors = { error: "" };

    addChildForm = new FormGroup({
        phone: this.phone
    });

    getErrorMessagePhone() {
        return this.phone.hasError("required")
            ? "Enter phone number"
            : this.phone.hasError("pattern")
            ? "Phone must contains only numbers"
            : this.phone.hasError("minlength")
            ? "Phone must be more than 5 numbers"
            : this.phone.hasError("maxlength")
            ? "Phone must be max 10 numbers"
            : "";
    }
    constructor(
        private apiService: ApiService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    onSubmit() {
        if (this.addChildForm.invalid) {
            throw "form is invalid";
        }
        this.errors.error = "";
        this.apiService.addChild(this.addChildForm.value).subscribe(
            res => {
                this.router.navigate(["children"]);
            },
            error => {
                this.errors = error.error;
                console.log(error);
                this.openSnackBar(this.errors.error, "close");
            }
        );
    }

    //func to open snackbar (material component) to show error which returns as response from server
    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 5000
        });
    }

    ngOnInit() {}
}
