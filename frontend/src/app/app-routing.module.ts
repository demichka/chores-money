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
import { ParentGuardService } from "./services/parent-guard.service";
import { AddChoreComponent } from "./components/add-chore/add-chore.component";
import { ChoresPageComponent } from "./components/chores-page/chores-page.component";
import { ChoresListComponent } from "./components/chores-list/chores-list.component";
import { BalancePageComponent } from "./components/balance-page/balance-page.component";
import { CreateTransactionComponent } from "./components/create-transaction/create-transaction.component";
import { MessagesPageComponent } from "./components/messages-page/messages-page.component";

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
                component: AddChildComponent,
                canActivate: [ParentGuardService]
            },
            {
                path: "children/register-child",
                component: RegisterChildComponent,
                canActivate: [ParentGuardService]
            },
            {
                path: "children",
                component: ChildrenListComponent,
                canActivate: [ParentGuardService]
            },
            {
                path: "chores",
                component: ChoresPageComponent,
                children: [
                    {
                        path: "",
                        component: ChoresListComponent
                    },
                    {
                        path: "add-chore",
                        component: AddChoreComponent
                    },
                    {
                        path: "edit-chore",
                        component: AddChoreComponent
                    }
                ]
            },
            {
                path: "create-transaction",
                component: CreateTransactionComponent
            },
            {
                path: "balance",
                component: BalancePageComponent
            },
            {
                path: "messages",
                component: MessagesPageComponent
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
