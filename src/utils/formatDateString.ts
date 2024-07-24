import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export function formatDateString(date: DateRange | undefined) {
  return date && date.from && date.to
    ? format(date.from, "d' de 'LLL")
        .concat(" até ")
        .concat(format(date.to, "d' de 'LLL"))
    : null;
}
