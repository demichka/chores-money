import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Action } from "rxjs/internal/scheduler/Action";

@Injectable({
    providedIn: "root"
})
export class MessageService {
    constructor(private apiService: ApiService) {}

    sendMessage(receiverId: string, text: string, choreAction: string) {
        let message = {
            text: text,
            choreAction: choreAction,
            receiverId: receiverId
        };

        this.apiService.createMessage(message).subscribe(
            res => {},
            error => {
                console.error(error);
            }
        );
    }
}
