import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Chore } from "src/app/models/chore.model";
import { User } from "src/app/models/user.model";

@Component({
    selector: "app-chore",
    templateUrl: "./chore.component.html",
    styleUrls: ["./chore.component.scss"]
})
export class ChoreComponent implements OnInit {
    @Input() item: Chore;
    @Input() user: User;
    @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() setDoneEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() setPaidEvent: EventEmitter<any> = new EventEmitter<any>();
    hideBtn: boolean = false;
    constructor() {}

    ngOnInit() {}

    //emit event to pass to chore-list as a parent to reject(false) or confirm(true) clicked chore
    confirmMe($event) {
        this.hideBtn = true;
        this.confirmEvent.emit({ confirm: $event, chore: this.item });
    }

    //emit event to pass to chore-list as a parent to set this chore to Done
    setDone() {
        this.hideBtn = true;
        this.setDoneEvent.emit(this.item);
    }
    payMe() {
        this.hideBtn = true;
        this.setPaidEvent.emit(this.item);
    }
}
