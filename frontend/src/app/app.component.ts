import { Component, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { User } from "./models/user.model";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    currentUser: User;

    constructor(private router: Router, private authService: AuthService) {}
}
