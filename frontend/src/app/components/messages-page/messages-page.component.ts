import { Component, OnInit } from "@angular/core";
import { Message } from "src/app/models/message.model";
import { AuthService } from "src/app/services/auth.service";
import { ApiService } from "src/app/services/api.service";
import { User } from "src/app/models/user.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: "app-messages-page",
    templateUrl: "./messages-page.component.html",
    styleUrls: ["./messages-page.component.scss"]
})
export class MessagesPageComponent implements OnInit {
    messages$: Observable<Message[]>;
    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.messages$ = this.apiService.getMessages().pipe(
            map(data => {
                return data.data;
            })
        );
    }
}
