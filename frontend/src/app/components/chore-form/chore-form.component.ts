import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "src/app/models/user.model";
import { ChoreInterface } from "src/app/models/chore.model";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-chore-form",
    templateUrl: "./chore-form.component.html",
    styleUrls: ["./chore-form.component.scss"]
})
export class ChoreFormComponent implements OnInit, OnDestroy {
    relatives: User[];
    user: User;
    desc = new FormControl("", [Validators.required, Validators.maxLength(50)]);
    cost = new FormControl(10, [Validators.required, Validators.max(300)]);
    receiver = new FormControl("");
    isDonation = new FormControl(false);

    choreForm = new FormGroup({
        desc: this.desc,
        cost: this.cost,
        isDonation: this.isDonation,
        phone: this.receiver
    });

    data: ChoreInterface;
    userSubscription: Subscription;
    isLoading: boolean = false;

    errors = { error: "" };

    getErrorMessageDesc() {
        return this.desc.hasError("required")
            ? "You must enter a value"
            : this.desc.hasError("maxlength")
            ? "Max length 50 characters"
            : "";
    }

    getErrorMessageCost() {
        return this.cost.hasError("required")
            ? "You must enter a value"
            : this.cost.hasError("max")
            ? "Max cost 300 SEK"
            : "";
    }

    getErrorMessageReceiver() {
        return this.receiver.hasError("required")
            ? "You must select a value"
            : "";
    }
    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute
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
            this.receiver.setValue(this.route.snapshot.queryParams.child);
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
            },
            error => {
                this.errors.error = error.error;
            }
        );
    }

    getParents() {
        this.apiService.getParentsList().subscribe(
            data => {
                this.relatives = data;
            },
            error => {
                this.errors.error = error.error;
                console.error(this.errors);
            }
        );
    }

    resetForm() {
        this.choreForm.reset();
        this.desc.setErrors(null);
        this.cost.setErrors(null);
        this.receiver.setErrors(null);
    }

    onSubmit() {
        if (this.choreForm.invalid) {
            throw "form is invalid";
        }
        this.errors.error = "";
        this.data = this.choreForm.value;
        this.apiService.addChore(this.data).subscribe(
            res => {
                this.openSnackBar(`New chore is created`, "Done");
            },
            error => {
                this.errors.error = error.error;
                this.openSnackBar(`Something went wrong. Try later`, "Close");
                console.error(this.errors);
            }
        );
    }

    //func to open snackbar (material component) to show message which returns as response from server
    openSnackBar(message: string, action: string) {
        this._snackBar
            .open(message, action, {
                duration: 1500
            })
            .afterOpened()
            .subscribe(done => {
                this.resetForm();
            });
    }
}
