import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "formatMinusValue"
})
export class FormatMinusValue implements PipeTransform {
    transform(value: any, arg?: any) {
        value = value.toString();
        return value.charAt(0) == "-"
            ? value.substring(1, value.length)
            : value;
    }
}
