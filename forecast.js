/* ============================================================
   Weather Forecast
   Renders the 7-day forecast cards (Home preview + full page)
   and the 24-hour temperature chart. Relies on pictoInfo()
   from script.js.
   Exposes: renderForecast(daily), renderHourlyChart(hourly)
   ============================================================ */

const forecastPreview = document.getElementById("forecastPreview");
const forecastRow = document.getElementById("forecastRow");
const forecastLocationLine = document.getElementById("forecastLocationLine");
const hourlyChart = document.getElementById("hourlyChart");

function forecastCardHTML(dateStr, i, info, hi, lo) {
  const dayFormatter = new Intl.DateTimeFormat([], { weekday: "short" });
  const date = new Date(dateStr);
  return `
    <div class="forecast__card">
      <p class="forecast__day">${i === 0 ? "Today" : dayFormatter.format(date)}</p>
      <div class="forecast__icon">${info.icon}</div>
      <span class="forecast__hi">${Math.round(hi)}°</span>
      <span class="forecast__lo">${Math.round(lo)}°</span>
    </div>
  `;
}

function renderForecast(daily) {
  forecastRow.innerHTML = daily.time
    .map((dateStr, i) => forecastCardHTML(dateStr, i, pictoInfo(daily.pictocode[i]), daily.temperature_max[i], daily.temperature_min[i]))
    .join("");

  forecastPreview.innerHTML = daily.time
    .slice(0, 3)
    .map((dateStr, i) => forecastCardHTML(dateStr, i, pictoInfo(daily.pictocode[i]), daily.temperature_max[i], daily.temperature_min[i]))
    .join("");
}

function renderHourlyChart(hourly) {
  if (!hourly || !hourly.time) return;

  const times = hourly.time.slice(0, 24);
  const temps = hourly.temperature.slice(0, 24);
  if (!times.length) return;

  const width = 720;
  const height = 140;
  const padX = 12;
  const padY = 18;

  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;

  const stepX = (width - padX * 2) / (temps.length - 1 || 1);
  const points = temps.map((t, i) => {
    const x = padX + i * stepX;
    const y = padY + (1 - (t - min) / range) * (height - padY * 2);
    return [x, y];
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1][0].toFixed(1)} ${height - padY} L ${points[0][0].toFixed(1)} ${height - padY} Z`;

  const labelFormatter = new Intl.DateTimeFormat([], { hour: "2-digit" });
  const labels = times
    .map((t, i) => ({ i, text: labelFormatter.format(new Date(t)) }))
    .filter((l) => l.i % 3 === 0);

  hourlyChart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height + 20}" preserveAspectRatio="none" class="hourly__svg">
      <defs>
        <linearGradient id="hourlyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--teal)" stop-opacity="0.35" />
          <stop offset="100%" stop-color="var(--teal)" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#hourlyFill)" stroke="none"></path>
      <path d="${linePath}" fill="none" stroke="var(--teal)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      ${points.map((p) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.5" fill="var(--teal)"></circle>`).join("")}
      ${labels.map((l) => `<text x="${(padX + l.i * stepX).toFixed(1)}" y="${height + 14}" class="hourly__label" text-anchor="middle">${l.text}</text>`).join("")}
    </svg>
  `;
}
