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
import { StartPageComponent } from './components/start-page/start-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { AddChildComponent } from './components/add-child/add-child.component';
import { RegisterChildComponent } from './components/register-child/register-child.component';
import { ChildrenListComponent } from './components/children-list/children-list.component';
import { ChildComponent } from './components/child/child.component';

@NgModule({
    declarations: [AppComponent, LoginComponent, MainPageComponent, StartPageComponent, RegisterPageComponent, RegisterFormComponent, MenuComponent, ProfilePageComponent, AddChildComponent, RegisterChildComponent, ChildrenListComponent, ChildComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [AuthService, AuthGuardService],
    bootstrap: [AppComponent]
})
export class AppModule {}
