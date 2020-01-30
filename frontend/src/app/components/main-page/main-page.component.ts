import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-main-page",
    templateUrl: "./main-page.component.html",
    styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit {
    title = "Chores&Money";

    user: User;

    isLoading: boolean = false;

    constructor(

        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) {
        
    }

    ngOnInit() {
        this.isLoading = true;
        this.userService.currentUser$.subscribe(user => {
            if (user) {
                this.user = user;
                this.isLoading = false;
            }
        });
    }

    logout() {
        this.authService.logout().subscribe(result => {
            this.router.navigate(["/login"]);
            this.userService.removeCurrentUser();
        });
    }
}
