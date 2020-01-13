import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-register-page",
    templateUrl: "./register-page.component.html",
    styleUrls: ["./register-page.component.scss"]
})
export class RegisterPageComponent implements OnInit {
    isParent: boolean = true;
    constructor() {}

    ngOnInit() {
        console.log(this.isParent);
    }
}
