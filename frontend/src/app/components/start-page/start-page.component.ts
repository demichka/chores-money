import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Chore } from "src/app/models/chore.model";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-start-page",
    templateUrl: "./start-page.component.html",
    styleUrls: ["./start-page.component.scss"]
})
export class StartPageComponent implements OnInit {
    choresHighights: {};
    unreadMessages: Message[];
    isLoading: boolean = true;
    isParent: boolean;

    unreadMessages$: Observable<any>; // observable for awaiting messages data
    constructor(
        private apiService: ApiService,
        private userService: UserService
    ) {
        this.unreadMessages$ = this.apiService.getMessages().pipe(
            map(data => {
                if (data.data.length) {
                    return data.data.filter(item => item.unread);
                } else {
                    return [];
                }
            })
        );
        this.checkData();
        this.userService.currentUser$.subscribe(
            data => {
                if (data) {
                    this.isParent = data.isParent;
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    ngOnInit() {}

    //function to check chores data for shortcuts, if there are some undone, done and unpaid chores, chores to confirm
    checkData() {
        this.apiService.getChoresList().subscribe(
            data => {
                if (!data.data) {
                    throw "No data returned";
                }
                this.choresHighights = this.calculateStatistic(data.data);
                this.isLoading = false;
            },
            error => {
                console.error(error);
            }
        );
    }

    //func to calculate quantities of chores for each type to show them in contrast badge on the shortcut
    calculateStatistic(data: Chore[]) {
        let result = { toPay: 0, toConfirm: 0, toDo: 0 };
        if (!data.length) {
            return result;
        }
        data.forEach(element => {
            if (element.isDone && !element.isPaid) {
                result.toPay++;
            }
            if (!element.isConfirmed) {
                result.toConfirm++;
            }
            if (element.isConfirmed && !element.isDone) {
                result.toDo++;
            }
        });
        return result;
    }
}
