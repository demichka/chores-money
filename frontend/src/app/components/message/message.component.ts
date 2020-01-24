import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Message } from "src/app/models/message.model";
import { ApiService } from "src/app/services/api.service";

@Component({
    selector: "app-message",
    templateUrl: "./message.component.html",
    styleUrls: ["./message.component.scss"]
})
export class MessageComponent implements OnInit {
    @Input() item: Message;
    hideItem: boolean = false;

    constructor(private apiService: ApiService) {}

    ngOnInit() {}

    onRead() {
        this.apiService.readMessage(this.item._id).subscribe(
            res => {
                this.item.unread = false;
            },
            error => {
                console.error(error);
            }
        );
    }

    onRemove() {
        this.apiService.removeMessage(this.item._id).subscribe(
            res => {
                this.hideItem = true;
            },
            error => {
                console.error(error);
            }
        );
    }
}
