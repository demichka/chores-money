import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Chore } from "src/app/models/chore.model";
import { AuthService } from "src/app/services/auth.service";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Subscription, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "src/app/user.service";

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

    unreadMessages$: Observable<any>;
    constructor(
        private apiService: ApiService,
        private authService: AuthService,
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
        this.userService.getUser().subscribe(
            data => {
                this.isParent = data.isParent;
            },
            error => {
                console.error(error);
            }
        );
    }

    ngOnInit() {}

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
