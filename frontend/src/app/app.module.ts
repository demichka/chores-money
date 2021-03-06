import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DemoMaterialModule } from "./material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { LoginComponent } from "./components/login/login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./services/auth.service";
import { AuthGuardService } from "./services/auth-guard.service";
import { StartPageComponent } from "./components/start-page/start-page.component";
import { RegisterPageComponent } from "./components/register-page/register-page.component";
import { RegisterFormComponent } from "./components/register-form/register-form.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ProfilePageComponent } from "./components/profile-page/profile-page.component";
import { AddChildComponent } from "./components/add-child/add-child.component";
import { RegisterChildComponent } from "./components/register-child/register-child.component";
import { ChildrenListComponent } from "./components/children-list/children-list.component";
import { ChildComponent } from "./components/child/child.component";
import { AddChoreComponent } from "./components/add-chore/add-chore.component";
import { ChoreFormComponent } from "./components/chore-form/chore-form.component";
import { ChoresPageComponent } from "./components/chores-page/chores-page.component";
import { ChoresListComponent } from "./components/chores-list/chores-list.component";
import { ChoreComponent } from "./components/chore/chore.component";
import { BalancePageComponent } from "./components/balance-page/balance-page.component";
import { TransactionComponent } from "./components/transaction/transaction.component";
import { CreateTransactionComponent } from "./components/create-transaction/create-transaction.component";
import { FormatMinusValue } from "./helpers/formatMinusValue.pipe";
import { ShortcutButtonComponent } from "./components/shortcut-button/shortcut-button.component";
import { MessageComponent } from "./components/message/message.component";
import { MessagesPageComponent } from "./components/messages-page/messages-page.component";
import { UserService } from "./services/user.service";
import { ParentGuardService } from "./services/parent-guard.service";
import { MessageService } from "./services/message.service";
import { ApiService } from "./services/api.service";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainPageComponent,
        StartPageComponent,
        RegisterPageComponent,
        RegisterFormComponent,
        MenuComponent,
        ProfilePageComponent,
        AddChildComponent,
        RegisterChildComponent,
        ChildrenListComponent,
        ChildComponent,
        AddChoreComponent,
        ChoreFormComponent,
        ChoresPageComponent,
        ChoresListComponent,
        ChoreComponent,
        BalancePageComponent,
        TransactionComponent,
        CreateTransactionComponent,
        FormatMinusValue,
        ShortcutButtonComponent,
        MessageComponent,
        MessagesPageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        AuthService,
        AuthGuardService,
        UserService,
        ParentGuardService,
        MessageService,
        ApiService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
