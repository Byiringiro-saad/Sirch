import ct from "countries-and-timezones";

export default function getCountry() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (timezone === "" || !timezone) {
    return null;
  }

  return ct.getCountriesForTimezone(timezone)[0];
}
