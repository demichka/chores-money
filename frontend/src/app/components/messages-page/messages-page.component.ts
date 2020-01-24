import { Component, OnInit } from "@angular/core";
import { Message } from "src/app/models/message.model";
import { AuthService } from "src/app/services/auth.service";
import { ApiService } from "src/app/services/api.service";
import { User } from "src/app/models/user.model";

@Component({
    selector: "app-messages-page",
    templateUrl: "./messages-page.component.html",
    styleUrls: ["./messages-page.component.scss"]
})
export class MessagesPageComponent implements OnInit {
    messages: Message[] = [];
    user: User;
    constructor(
        private authService: AuthService,
        private apiService: ApiService
    ) {
        this.user = this.authService.currentUserValue;
    }

    ngOnInit() {
        this.getMessages();
    }

    getMessages() {
        this.apiService.getMessages().subscribe(
            data => {
                this.messages = data.data;
            },
            error => {
                console.error(error);
            }
        );
    }
}
