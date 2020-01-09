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

@NgModule({
    declarations: [AppComponent, LoginComponent, MainPageComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
