import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "src/app/models/user.model";
import { ChoreInterface } from "src/app/models/chore.model";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-chore-form",
    templateUrl: "./chore-form.component.html",
    styleUrls: ["./chore-form.component.scss"]
})
export class ChoreFormComponent implements OnInit, OnDestroy {
    relatives: User[];
    user: User;
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
    userSubscription: Subscription;
    isLoading: boolean = false;

    errors = { error: "" };

    getErrorMessage() {
        return this.desc.hasError("required") ? "You must enter a value" : "";
    }
    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {
        this.isLoading = true;
        this.userSubscription = this.authService.currentUser$.subscribe(
            user => {
                this.user = user;
                this.isLoading = false;
            }
        );
    }

    ngOnInit() {
        if (!this.isLoading && this.user.isParent) {
            this.getChildren();
        } else {
            this.getParents();
        }
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }

    getChildren() {
        this.apiService.getChildrenList().subscribe(
            data => {
                this.relatives = data;
                console.log(this.relatives);
            },
            error => {
                this.errors.error = error.error;
                console.error(this.errors);
            }
        );
    }

    getParents() {
        this.apiService.getParentsList().subscribe(
            data => {
                this.relatives = data;
                console.log(this.relatives, "parents");
            },
            error => {
                this.errors.error = error.error;
                console.error(this.errors);
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
