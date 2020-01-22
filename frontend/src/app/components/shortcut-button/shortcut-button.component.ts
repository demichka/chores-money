import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-shortcut-button",
    templateUrl: "./shortcut-button.component.html",
    styleUrls: ["./shortcut-button.component.scss"]
})
export class ShortcutButtonComponent implements OnInit {
    @Input() title: String;
    @Input() link: String;
    @Input() params: [];
    @Input() icon: String;
    constructor() {}

    ngOnInit() {}
}
