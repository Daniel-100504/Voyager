/* ============================================================
   Travel Advisory
   Computes and renders the 🟢🟡🔴 travel advisory rating —
   both the compact badge on Home and the full detail page.
   Exposes: setAdvisory(info, currentWind, maxWindToday, rainChance)
   ============================================================ */

const advisoryHero = document.getElementById("advisory");
const advisoryFullBadge = document.getElementById("advisoryFullBadge");
const advisoryFullLevel = document.getElementById("advisoryFullLevel");
const advisoryFullText = document.getElementById("advisoryFullText");
const advisoryFactors = document.getElementById("advisoryFactors");

function setAdvisory(info, currentWind, maxWindToday, rainChance) {
  const category = info.category;
  let level = "safe";
  let text = "Conditions look clear — safe to travel.";

  const severe = category === "storm" || maxWindToday >= 60 || rainChance >= 80;
  const caution = category === "rain" || category === "snow" || category === "fog" ||
                   maxWindToday >= 35 || rainChance >= 45 || currentWind >= 35;

  if (severe) {
    level = "danger";
    text = "Severe weather expected — travel not recommended.";
  } else if (caution) {
    level = "caution";
    text = "Changeable conditions — travel with caution.";
  }

  const dotIcon = level === "danger" ? "🔴" : level === "caution" ? "🟡" : "🟢";
  const levelLabel = level === "danger" ? "Travel not recommended" : level === "caution" ? "Travel with caution" : "Safe to travel";

  // Compact badge on Home
  advisoryHero.dataset.level = level;
  advisoryHero.querySelector(".hero__advisory-text").textContent = `${dotIcon} ${text}`;

  // Full detail on the Advisory page
  advisoryFullBadge.textContent = dotIcon;
  advisoryFullLevel.textContent = levelLabel;
  advisoryFullText.textContent = `${text} Based on current conditions along the route: ${info.label.toLowerCase()}.`;

  const factors = [
    `Condition: ${info.label}`,
    `Wind now: ${currentWind} km/h`,
    `Wind today (peak): ${Math.round(maxWindToday)} km/h`,
    `Rain chance today: ${Math.round(rainChance)}%`,
  ];
  advisoryFactors.innerHTML = factors.map((f) => `<li>${f}</li>`).join("");
}
