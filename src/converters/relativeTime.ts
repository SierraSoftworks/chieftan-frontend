import * as moment from "moment";

export class RelativeTimeValueConverter {
  toView(time: Date|string|number) {
    return moment.utc(time).fromNow();
  }
}
