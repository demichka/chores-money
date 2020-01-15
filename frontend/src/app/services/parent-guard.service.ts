import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import { User } from "../models/user.model";

@Injectable({
    providedIn: "root"
})
export class ParentGuardService implements CanActivate {
    user: User;
    constructor(private authService: AuthService, private router: Router) {}

    canActivate() {
        this.user = this.authService.currentUserValue;
        if (this.user && this.user.isParent) {
            return true;
        }

        this.router.navigate(["/"]);
        return false;
    }
}
