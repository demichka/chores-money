import { Injectable } from "@angular/core";
import {
    CanActivate,
    CanActivateChild,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class AuthGuardService implements CanActivate, CanActivateChild {
    isLoggedIn;

    constructor(private router: Router, private authService: AuthService) {
        // console.log(this.isLoggedIn, "loggend in");
        // this.authService.checkLogin().subscribe(res => {
        //     if (res) {
        //         this.isLoggedIn = true;
        //     } else {
        //         this.isLoggedIn = false;
        //     }
        // });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.checkLogin().pipe(
            map(auth => {
                if (auth) {
                    console.log(auth, "auth");
                    return true;
                } else {
                    this.router.navigate(["/login"]);
                    return false;
                }
            })
        );
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }
}
