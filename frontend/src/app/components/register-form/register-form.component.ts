import { Component, OnInit, Input } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { UserInterface } from "src/app/models/user.model";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "app-register-form",
    templateUrl: "./register-form.component.html",
    styleUrls: ["./register-form.component.scss"]
})
export class RegisterFormComponent implements OnInit {
    @Input() isParent: boolean;
    name = new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)
    ]);
    phone = new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(5),
        Validators.pattern("^[0-9]*$")
    ]);
    email = new FormControl("", [Validators.required, Validators.email]);
    password = new FormControl("", [
        Validators.required,
        Validators.maxLength(12),
        Validators.minLength(5)
    ]);
    parent = new FormControl(false);
    hide = true;
    data: UserInterface;
    errors = { error: "" };

    registerForm = new FormGroup({
        name: this.name,
        phone: this.phone,
        email: this.email,
        password: this.password,
        isParent: this.parent
    });

    //funcs to show errors if inputs are invalid
    getErrorMessage() {
        return this.email.hasError("required")
            ? "You must enter a value"
            : this.email.hasError("email")
            ? "Not a valid email"
            : "";
    }

    getErrorMessageName() {
        return this.name.hasError("required")
            ? "Enter name"
            : this.name.hasError("minlength")
            ? "You must enter more than 3 characters"
            : this.name.hasError("maxlength")
            ? "Name must be max 10 characters"
            : "";
    }

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

    getErrorMessagePwd() {
        return this.password.hasError("required")
            ? "Enter password"
            : this.password.hasError("minlength")
            ? "You must enter more than 5 characters"
            : this.password.hasError("maxlength")
            ? "Name must be max 12 characters"
            : "";
    }

    constructor(
        private apiService: ApiService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    onSubmit() {
        if (this.registerForm.invalid) {
            throw "form is invalid";
        }
        this.errors.error = "";
        this.data = this.registerForm.value;
        if (this.isParent) {
            this.apiService.registerAccount(this.data).subscribe(
                res => {
                    this.router.navigate(["login"]);
                },
                error => {
                    this.errors = error.error;
                    this.openSnackBar(this.errors.error, "close");
                }
            );
        } else {
            this.apiService.registerChildAccount(this.data).subscribe(
                res => {
                    this.router.navigate(["children"]);
                },
                error => {
                    this.errors = error.error;
                    this.openSnackBar(this.errors.error, "close");
                }
            );
        }
    }

    //func to open snackbar (material component) to show error which returns as response from server
    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 5000
        });
    }

    ngOnInit() {
        // set isParent as true if this form is a child to registration-page
        //otherwise it means that form is for creating child account (another parent component)
        this.parent.setValue(this.isParent);
    }
}
