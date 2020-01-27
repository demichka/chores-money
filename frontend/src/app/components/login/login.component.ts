import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { first, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "src/app/services/api.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
    email = new FormControl("", [Validators.required, Validators.email]);
    password = new FormControl("");
    hide = true;
    login = { email: "", password: "" };

    loginForm = new FormGroup({
        email: this.email,
        password: this.password
    });

    getErrorMessage() {
        return this.email.hasError("required")
            ? "You must enter a value"
            : this.email.hasError("email")
            ? "Not a valid email"
            : "";
    }
    constructor(
        private authService: AuthService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private apiService: ApiService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.userService.currentUser$.subscribe(user => {
            if (user) {
                this.router.navigate(["/"]);
            }
        });
    }

    onSubmit() {
        if (this.email.invalid) {
            throw "email is invalid";
        }
        if (this.password.invalid) {
            throw "password is invalid";
        }
        this.login.email = this.email.value;
        this.login.password = this.password.value;

        this.authService
            .login(this.login)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(["/"]);
                },
                error => {
                    this.openSnackBar("An error occured.", "close");
                }
            );
    }

    resetPassword() {
        this.apiService.resetPassword(this.loginForm.value.email).subscribe(
            res => {
                console.log(res);
            },
            error => {
                console.error(error);
            }
        );
    }

    //func to open snackbar (material component) to show error which returns as response from server
    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 5000
        });
    }
}
