import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { AuthGuardService } from "./services/auth-guard.service";
import { StartPageComponent } from "./components/start-page/start-page.component";

const routes: Routes = [
    {
        path: "",
        component: MainPageComponent,
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: "",
                component: StartPageComponent
            }
        ]
    },
    { path: "login", component: LoginComponent },
    { path: "**", redirectTo: "" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
