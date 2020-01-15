import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user.model";
import { ApiService } from "src/app/services/api.service";

@Component({
    selector: "app-children-list",
    templateUrl: "./children-list.component.html",
    styleUrls: ["./children-list.component.scss"]
})
export class ChildrenListComponent implements OnInit {
    childrenList: User[] = [];
    errors: { error: "" };
    constructor(private apiService: ApiService) {
        this.apiService.getChildrenList().subscribe(
            data => {
                this.childrenList = data;
                console.log(this.childrenList, "children");
            },
            error => {
                this.errors.error = error.error;
            }
        );
    }

    ngOnInit() {}
}
