import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "src/app/models/user.model";
import { Chore } from "src/app/models/chore.model";
import { ApiService } from "src/app/services/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "src/app/services/message.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-chore-form",
    templateUrl: "./chore-form.component.html",
    styleUrls: ["./chore-form.component.scss"]
})
export class ChoreFormComponent implements OnInit {
    relatives: User[];
    user: User;
    desc = new FormControl("", [Validators.required, Validators.maxLength(50)]);
    cost = new FormControl(10, [Validators.required, Validators.max(300)]);
    receiver = new FormControl("", [Validators.required]);
    isDonation = new FormControl(false);
    editableChore: Chore;
    editMode: boolean = false;

    choreForm = new FormGroup({
        desc: this.desc,
        cost: this.cost,
        isDonation: this.isDonation,
        receiver: this.receiver
    });

    isLoading: boolean;

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
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private userService: UserService
    ) {
        this.isLoading = true;
        this.userService.currentUser$.subscribe(user => {
            if (user === null) {
                return;
            }
            this.user = user;
            if (this.user.isParent) {
                this.getChildren();
                if (this.route.snapshot.queryParams.child) {
                    this.receiver.setValue(
                        this.route.snapshot.queryParams.child
                    );
                }
            } else {
                this.getParents();
            }
            this.isLoading = false;
        });
    }

    ngOnInit() {
        if (this.route.snapshot.queryParams.chore) {
            this.editMode = true;
            this.apiService
                .getChoreById(this.route.snapshot.queryParams.chore)
                .subscribe(chore => {
                    this.editableChore = chore;
                    this.choreForm.setValue({
                        desc: chore.desc,
                        cost: chore.cost,
                        isDonation: chore.isDonation,
                        receiver: this.user.isParent
                            ? chore.performer._id
                            : chore.payer._id
                    });
                });
        }
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
        this.isDonation.setValue(false);
    }

    onSubmit() {
        if (this.choreForm.invalid) {
            return;
        }

        if (this.editMode) {
            this.apiService
                .updateChore(this.editableChore._id, this.choreForm.value)
                .subscribe(
                    res => {
                        this.openSnackBar(`Chore is updated`, "Done");
                        this.editMode = false;
                    },
                    error => {
                        this.openSnackBar(
                            `Error occured. Check form and try again`,
                            "Close"
                        );
                    }
                );
            return;
        }
        this.apiService.addChore(this.choreForm.value).subscribe(
            res => {
                this.openSnackBar(`New chore is created`, "Done");
                let messageText = `A new chore from ${this.user.name}.`;
                let choreAction = "created";
                if (this.choreForm.value.isDonation && this.user.isParent) {
                    messageText = `A new donation from ${this.user.name}.`;
                    choreAction = "donated";
                }

                if (!this.user.isParent) {
                    messageText = `Chore to review from ${this.user.name}.`;
                    choreAction = "review";
                }
                this.messageService.sendMessage(
                    this.receiver.value,
                    messageText,
                    choreAction
                );
            },
            error => {
                this.openSnackBar(
                    `Error occured. Check form and try again`,
                    "Close"
                );
            }
        );
    }

    //delete chore

    removeChore() {
        this.apiService.removeChore(this.editableChore._id).subscribe(
            res => {
                this.openSnackBar(`The chore was removed`, "Done");
            },
            error => {
                this.openSnackBar(`Error occured. Try later`, "Close");
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
                this.router.navigate(["/"]);
            });
    }
}
