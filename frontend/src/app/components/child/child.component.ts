import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/models/user.model";
import { ApiService } from "src/app/services/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "app-child",
    templateUrl: "./child.component.html",
    styleUrls: ["./child.component.scss"]
})
export class ChildComponent implements OnInit {
    @Input() item: User;
    hide: boolean = false;
    constructor(
        private apiService: ApiService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit() {}

    removeChild() {
        this.apiService.removeChildFromList(this.item._id).subscribe(
            res => {
                this.hide = true;
                this.openSnackBar(
                    `The child was removed from your list`,
                    "Done"
                );
            },
            error => {
                this.openSnackBar(
                    error.error.error ? error.error.error : "An error occured",
                    "Close"
                );
            }
        );
    }

    //func to open snackbar (material component) to show message which returns as response from server
    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 1500
        });
    }
}
