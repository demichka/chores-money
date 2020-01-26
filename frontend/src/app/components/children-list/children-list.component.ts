import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user.model";
import { ApiService } from "src/app/services/api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: "app-children-list",
    templateUrl: "./children-list.component.html",
    styleUrls: ["./children-list.component.scss"]
})
export class ChildrenListComponent implements OnInit {
    childrenList$: Observable<User[]>;
    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.childrenList$ = this.apiService.getChildrenList().pipe(
            map(data => {
                return data;
            })
        );
    }
}
