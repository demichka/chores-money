import { Component, OnInit, Input } from "@angular/core";
import { Chore } from "src/app/models/chore.model";

@Component({
    selector: "app-chore",
    templateUrl: "./chore.component.html",
    styleUrls: ["./chore.component.scss"]
})
export class ChoreComponent implements OnInit {
    @Input() item: Chore;
    constructor() {}

    ngOnInit() {}
}
