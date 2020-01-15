import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "src/app/models/user.model";
import { ChoreInterface } from "src/app/models/chore.model";
import { ApiService } from "src/app/services/api.service";
import { ParentGuardService } from "src/app/services/parent-guard.service";
import { AuthGuardService } from "src/app/services/auth-guard.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
    selector: "app-chore-form",
    templateUrl: "./chore-form.component.html",
    styleUrls: ["./chore-form.component.scss"]
})
export class ChoreFormComponent implements OnInit, AfterViewInit {
    relatives: User[];
    isParent: boolean;
    desc = new FormControl("", [Validators.required]);
    cost = new FormControl(10, [Validators.required]);
    isDonation = new FormControl(false);
    choreForm = new FormGroup({
        desc: this.desc,
        cost: this.cost,
        isDonation: this.isDonation,
        phone: new FormControl("")
    });

    data: ChoreInterface;

    errors = { error: "" };

    getErrorMessage() {
        return this.desc.hasError("required") ? "You must enter a value" : "";
    }
    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.authService.currentUser$.subscribe(data => {
            console.log(data, "data");
            if (data.isParent) {
                this.getChildren();
            }
        });
    }

    ngAfterViewInit() {}

    getChildren() {
        this.apiService.getChildrenList().subscribe(
            data => {
                this.relatives = data;
                console.log(this.relatives);
            },
            error => {
                this.errors.error = error.error;
            }
        );
    }

    onSubmit() {
        if (this.choreForm.invalid) {
            throw "form is invalid";
        }
        this.errors.error = "";
        this.data = this.choreForm.value;
        console.log(this.data);
    }
}
