import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { ApiService } from "src/app/services/api.service";
import { User } from "src/app/models/user.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-profile-page",
    templateUrl: "./profile-page.component.html",
    styleUrls: ["./profile-page.component.scss"]
})
export class ProfilePageComponent implements OnInit {
    title: String = "User profile";
    user: User;
    isLoading: boolean;
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
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.isLoading = true;
        this.userService.currentUser$.subscribe(user => {
            this.user = user;
            this.fillFormWithUserInfo(this.user);
            this.isLoading = false;
        });
    }

    fillFormWithUserInfo(user: User) {
        this.updateProfileForm.setValue({
            name: user.name,
            phone: user.phone,
            email: user.email
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
        this.apiService.updateProfile(this.updateProfileForm.value).subscribe(
            res => {
                this.userService.reloadUser();
                this.openSnackBar("Profile is updated successfully", "close");
            },
            error => {
                if (error.error.code == "duplicatePhone") {
                    this.phone.setErrors({
                        errors: error.error.code
                    });
                }
                if (error.error.code == "duplicateEmail") {
                    this.email.setErrors({
                        errors: error.error.code
                    });
                }
                console.log(error);
                this.openSnackBar(error.error.errMsg, "close");
            }
        );
    }

    //func to reset form to previous state and navigate to root

    cancelEdit() {
        this.fillFormWithUserInfo(this.user);
        this.router.navigate(["/"]);
    }

    //func to open snackbar (material component) to show message which returns as response from server
    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 1500
        });
    }
}
