import { Component, OnInit, Input } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";

export interface UserInterface {
    name: string;
    phone: string;
    email: string;
    password: string;
    isParent: boolean;
}
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

    onSubmit() {
        if (this.registerForm.invalid) {
            throw "form is invalid";
        }
        this.data = this.registerForm.value;
        console.log(this.data);
    }
    constructor() {}

    ngOnInit() {
        this.parent.setValue(this.isParent);
    }
}
