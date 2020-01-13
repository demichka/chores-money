import { Component, OnDestroy, ChangeDetectorRef, OnInit } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { User } from "src/app/models/user.model";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-main-page",
    templateUrl: "./main-page.component.html",
    styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit, OnDestroy {
    title = "Chores&Money";

    mobileQuery: MediaQueryList;

    onNotice: boolean = true;

    saveChoice: boolean = false;

    user: User;

    userSubscription: Subscription;

    private _mobileQueryListener: () => void;

    isLoading: boolean = false;

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private authService: AuthService,
        private router: Router
    ) {
        if (window.localStorage.getItem("saveChoice") === null) {
            window.localStorage.setItem("saveChoice", "false");
        }
        this.mobileQuery = media.matchMedia("(max-width: 768px)");
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.onNotice =
            window.localStorage.getItem("saveChoice") === "false"
                ? true
                : false;
    }

    ngOnInit() {
        this.isLoading = true;
        this.userSubscription = this.authService.currentUser$.subscribe(
            user => {
                this.isLoading = false;
                this.user = user;
            }
        );
    }

    toggleNotice() {
        this.onNotice = !this.onNotice;
        if (this.saveChoice) {
            window.localStorage.setItem("saveChoice", String(this.saveChoice));
        }
    }

    setSaveChoice() {
        this.saveChoice = !this.saveChoice;
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    logout() {
        this.authService
            .logout()
            .subscribe(result => this.router.navigate(["/login"]));
    }
}
