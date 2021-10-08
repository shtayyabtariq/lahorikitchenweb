import { Pipe, PipeTransform } from "@angular/core";
import { ApputilsService } from "./apputils.service";

@Pipe({
  name: "status",
})
export class StatusPipe implements PipeTransform {
  transform(value: String, ApputilsService: ApputilsService): string | null {
    var status = "";
    switch (value) {
      case "Open":
        return "primary";
        break;
      case "Booked":
        return "success";
        break;
      case "Hold":
        return "danger";
        break;
    }
  }
}
