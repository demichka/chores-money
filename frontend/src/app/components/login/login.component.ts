import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";

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
    constructor(private authService: AuthService, private router: Router) {
        if (this.authService.currentUserValue) {
            this.router.navigate(["/"]);
        }
    }

    ngOnInit() {}

    onSubmit() {
        if (this.email.invalid) {
            throw "email is invalid";
        }
        if (this.password.invalid) {
            throw "password is invalid";
        }
        this.login.email = this.email.value;
        this.login.password = this.password.value;
        console.log(this.login);

        this.authService
            .login(this.login)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(["/"]);
                },
                error => {
                    console.error(error);
                }
            );
    }
}
