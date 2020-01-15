import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/models/user.model";

@Component({
    selector: "app-child",
    templateUrl: "./child.component.html",
    styleUrls: ["./child.component.scss"]
})
export class ChildComponent implements OnInit {
    @Input() item: User;
    constructor() {}

    ngOnInit() {}
}
