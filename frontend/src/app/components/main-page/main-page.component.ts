import { Component, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent {
  title = "Chores&Money";

  mobileQuery: MediaQueryList;

  onNotice: boolean = true;

  saveChoice: boolean = false;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    if (window.localStorage.getItem("saveChoice") === null) {
      window.localStorage.setItem("saveChoice", "false");
    }
    this.mobileQuery = media.matchMedia("(max-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.onNotice =
      window.localStorage.getItem("saveChoice") === "false" ? true : false;
  }

  toggleNotice() {
    this.onNotice = !this.onNotice;
    if (this.saveChoice) {
      window.localStorage.setItem("saveChoice", String(this.saveChoice));
    }
  }

  setSaveChoice() {
    this.saveChoice = !this.saveChoice;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
