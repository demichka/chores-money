import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { ApiService } from "src/app/services/api.service";
import { User } from "src/app/models/user.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "app-profile-page",
    templateUrl: "./profile-page.component.html",
    styleUrls: ["./profile-page.component.scss"]
})
export class ProfilePageComponent implements OnInit {
    title: String = "User profile";
    // errors: {error: ""};

    user: User;
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

    updateProfileForm = new FormGroup({
        name: this.name,
        phone: this.phone,
        email: this.email
    });

    constructor(
        private authService: AuthService,
        private apiService: ApiService,
        private _snackBar: MatSnackBar
    ) {
        this.authService.currentUser$.subscribe(user => (this.user = user));
        console.log(this.user);
    }

    ngOnInit() {
        this.updateProfileForm.setValue({
            name: this.user.name,
            phone: this.user.phone,
            email: this.user.email
        });
    }

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

    onSubmit() {
        if (this.updateProfileForm.invalid) {
            throw "form is invalid";
        }
        var errors = {};
        console.log(this.updateProfileForm.value);
        this.apiService.updateProfile(this.updateProfileForm.value).subscribe(
            res => {
                this.authService.checkAuth();
                this.openSnackBar("Profile is updated successfully", "close");
            },
            error => {
                error = { ...error.error };
                console.log(error);
                this.openSnackBar(error.error, "close");
            }
        );
    }

    //func to open snackbar (material component) to show message which returns as response from server
    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 1500
        });
    }
}
