import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { AuthGuardService } from "./services/auth-guard.service";
import { StartPageComponent } from "./components/start-page/start-page.component";
import { RegisterPageComponent } from "./components/register-page/register-page.component";
import { ProfilePageComponent } from "./components/profile-page/profile-page.component";
import { AddChildComponent } from "./components/add-child/add-child.component";
import { RegisterChildComponent } from "./components/register-child/register-child.component";
import { ChildrenListComponent } from "./components/children-list/children-list.component";

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
            },
            {
                path: "profile",
                component: ProfilePageComponent
            },
            {
                path: "children/add-child",
                component: AddChildComponent
            },
            {
                path: "children/register-child",
                component: RegisterChildComponent
            },
            {
                path: "children",
                component: ChildrenListComponent
            }
        ]
    },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterPageComponent },
    { path: "**", redirectTo: "" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
