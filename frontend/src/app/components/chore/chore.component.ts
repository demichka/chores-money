import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Chore } from "src/app/models/chore.model";

@Component({
    selector: "app-chore",
    templateUrl: "./chore.component.html",
    styleUrls: ["./chore.component.scss"]
})
export class ChoreComponent implements OnInit {
    @Input() item: Chore;
    @Input() isParent: boolean;
    @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();
    constructor() {}

    ngOnInit() {}

    confirmMe($event) {
        this.confirmEvent.emit({ confirm: $event, chore: this.item._id });
    }
    rejectMe($event) {
        this.confirmEvent.emit($event);
    }
}
