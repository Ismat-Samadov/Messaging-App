import { DateTime } from "luxon";

export default function formatDate(messageTime) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // // use users time zone to format the date of comment
  const formattedDate = DateTime.fromISO(messageTime)
    .setZone(userTimeZone)
    .toLocaleString(DateTime.DATETIME_MED);
  return formattedDate;
}
