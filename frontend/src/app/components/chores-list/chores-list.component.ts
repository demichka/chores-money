import { Component, OnInit } from "@angular/core";
import { Chore } from "src/app/models/chore.model";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";

@Component({
    selector: "app-chores-list",
    templateUrl: "./chores-list.component.html",
    styleUrls: ["./chores-list.component.scss"]
})
export class ChoresListComponent implements OnInit {
    choresList: { data: Chore[] };
    errors: { error: "" };
    isLoading: boolean;
    user: User;
    private _filteredChores: {
        doneNotPaidChores: Chore[];
        choresToConfirm: Chore[];
        archivedChores: Chore[];
        toDo: Chore[];
    };

    public set filteredChores(value: {
        doneNotPaidChores: Chore[];
        choresToConfirm: Chore[];
        archivedChores: Chore[];
        toDo: Chore[];
    }) {
        this._filteredChores = value;
    }
    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {
        this.authService.currentUser$.subscribe(user => (this.user = user));
        this.getChoresList();
    }

    ngOnInit() {}

    getChoresList() {
        this.isLoading = true;
        this.apiService.getChoresList().subscribe(
            data => {
                this.choresList = data;
                this.filterChores();
                this.isLoading = false;
                console.log(this.choresList);
            },
            error => {
                this.errors.error = error.error;
                console.error(this.errors);
            }
        );
    }

    filterChores() {
        let keys = Object.keys(this.choresList);
        console.log(keys, "keys");
        console.log(this.user);
        const toDo = this.choresList[keys[0]].filter(
            item => item.isConfirmed && !item.isPaid && !item.isDone
        );
        const doneNotPaidChores = this.choresList[keys[0]].filter(
            item => item.isDone && !item.isPaid
        );

        const choresToConfirm = this.choresList[keys[0]].filter(
            item => !item.isDone && !item.isConfirmed
        );

        const archivedChores = this.choresList[keys[0]].filter(
            item => item.isPaid
        );
        this.filteredChores = {
            doneNotPaidChores,
            choresToConfirm,
            archivedChores,
            toDo
        };
    }

    confirmChore($event) {
        if ($event.confirm) {
            this.apiService.confirmChore($event.chore).subscribe(
                res => {
                    this.getChoresList();
                },
                error => {
                    console.error(error.error);
                }
            );
        } else {
            console.log("It will be rejected");
        }
    }
}
