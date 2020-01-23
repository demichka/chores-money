import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Chore } from "src/app/models/chore.model";
import { AuthService } from "src/app/services/auth.service";

@Component({
    selector: "app-start-page",
    templateUrl: "./start-page.component.html",
    styleUrls: ["./start-page.component.scss"]
})
export class StartPageComponent implements OnInit {
    choresHighights: {};
    isLoading: boolean = true;
    isParent: boolean;
    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {
        this.checkData();
        this.isParent = this.authService.currentUserValue.isParent;
    }

    ngOnInit() {}

    checkData() {
        this.apiService.getChoresList().subscribe(
            data => {
                if (!data.data) {
                    throw "No data returned";
                }
                this.isLoading = false;
                this.choresHighights = this.calculateStatistic(data.data);
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
