import { Component, OnInit } from "@angular/core";
import { ParentGuardService } from "src/app/services/parent-guard.service";

@Component({
    selector: "app-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
    isParent: boolean;
    constructor(private parentGuard: ParentGuardService) {
        this.isParent = this.parentGuard.canActivate();
    }

    ngOnInit() {}
}
