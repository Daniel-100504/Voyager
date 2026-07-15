/* ============================================================
   Weather Alerts
   Site-wide banner shown when today's conditions pose a
   real travel risk (storms, high wind, heavy rain, blowing snow).
   Exposes: setAlert(category, maxWindToday, rainChance)
   ============================================================ */

const alertBanner = document.getElementById("alertBanner");
const alertText = document.getElementById("alertText");

function setAlert(category, maxWindToday, rainChance) {
  let message = null;

  if (category === "storm") {
    message = "Thunderstorm activity detected in the area. Seek shelter and avoid unnecessary travel.";
  } else if (maxWindToday >= 60) {
    message = `Strong winds expected today (up to ${Math.round(maxWindToday)} km/h). Secure loose objects outdoors.`;
  } else if (rainChance >= 80) {
    message = `Heavy rain likely today (${Math.round(rainChance)}% chance). Watch for localized flooding.`;
  } else if (category === "snow" && maxWindToday >= 40) {
    message = "Blowing snow expected — reduced visibility on the road.";
  }

  if (message) {
    alertText.textContent = message;
    alertBanner.hidden = false;
  } else {
    alertBanner.hidden = true;
  }
}
