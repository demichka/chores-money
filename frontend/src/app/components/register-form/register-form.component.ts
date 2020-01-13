import { Component, OnInit, Input } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { UserInterface } from "src/app/models/user.model";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-register-form",
    templateUrl: "./register-form.component.html",
    styleUrls: ["./register-form.component.scss"]
})
export class RegisterFormComponent implements OnInit {
    @Input() isParent: boolean;
    name = new FormControl("");
    phone = new FormControl("");
    email = new FormControl("", [Validators.required, Validators.email]);
    password = new FormControl("");
    parent = new FormControl(false);
    hide = true;
    data: UserInterface;
    errors: {};

    registerForm = new FormGroup({
        name: this.name,
        phone: this.phone,
        email: this.email,
        password: this.password,
        isParent: this.parent
    });

    getErrorMessage() {
        return this.email.hasError("required")
            ? "You must enter a value"
            : this.email.hasError("email")
            ? "Not a valid email"
            : "";
    }

    constructor(private apiService: ApiService, private router: Router) {}

    onSubmit() {
        if (this.registerForm.invalid) {
            throw "form is invalid";
        }
        this.data = this.registerForm.value;
        console.log(this.data);
        this.apiService.registerAccount(this.data).subscribe(
            res => {
                this.router.navigate(["login"]);
            },
            error => {
                this.errors = error.error;
                console.log(this.errors, "errors");
            }
        );
    }

    ngOnInit() {
        this.parent.setValue(this.isParent);
    }

    redirectUrl() {}
}
