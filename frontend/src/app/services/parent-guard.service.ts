import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { User } from "../models/user.model";
import { UserService } from "./user.service";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class ParentGuardService implements CanActivate {
    user: User;
    constructor(private userService: UserService, private router: Router) {}

    //this parent guard check if user is parent or not and give access or not to some routes (add-child, children etc)
    canActivate() {
        return this.userService.currentUser$.pipe(
            map(user => {
                if (user && user.isParent) {
                    return true;
                } else {
                    this.router.navigate(["/"]);
                    return false;
                }
            })
        );
    }
}
