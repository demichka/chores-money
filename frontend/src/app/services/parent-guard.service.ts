import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router, CanActivate } from "@angular/router";
import { User } from "../models/user.model";

@Injectable({
    providedIn: "root"
})
export class ParentGuardService implements CanActivate {
    user: User;
    constructor(private authService: AuthService, private router: Router) {}

    //this parent guard check if user is parent or not and give access or not to some routes (add-child, children etc)
    canActivate() {
        this.user = this.authService.currentUserValue;
        if (this.user && this.user.isParent) {
            return true;
        }

        this.router.navigate(["/"]);
        return false;
    }
}
