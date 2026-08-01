export function formatTime(timeStr) {
  if (!timeStr) return '';
  if (timeStr.includes('T')) {
    const timePart = timeStr.split('T')[1];
    const [h, m] = timePart.split(':');
    return `${h}:${m}`;
  }
  return timeStr;
}

export function formatDateDayName(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function calculateTimePhase(weatherData, timeMode = 'auto') {
  if (timeMode !== 'auto') return timeMode;

  let currentMins = null;
  if (weatherData && weatherData.current && weatherData.current.time) {
    const timeStr = weatherData.current.time;
    const timePart = timeStr.includes('T') ? timeStr.split('T')[1] : timeStr;
    const [h, m] = timePart.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      currentMins = h * 60 + m;
    }
  }

  if (currentMins === null) {
    const now = new Date();
    currentMins = now.getHours() * 60 + now.getMinutes();
  }

  let phase = 'day';

  if (weatherData && weatherData.daily && weatherData.daily.sunrise && weatherData.daily.sunrise[0]) {
    const sunriseStr = weatherData.daily.sunrise[0].split('T')[1] || "06:00";
    const sunsetStr = weatherData.daily.sunset[0].split('T')[1] || "18:30";

    const [srH, srM] = sunriseStr.split(':').map(Number);
    const [ssH, ssM] = sunsetStr.split(':').map(Number);

    const srTotal = srH * 60 + srM;
    const ssTotal = ssH * 60 + ssM;

    if (currentMins >= (srTotal - 45) && currentMins < (srTotal + 90)) {
      phase = 'dawn';
    } else if (currentMins >= (srTotal + 90) && currentMins < (ssTotal - 45)) {
      phase = 'day';
    } else if (currentMins >= (ssTotal - 45) && currentMins < (ssTotal + 90)) {
      phase = 'dusk';
    } else {
      phase = 'night';
    }
  } else {
    const hour = Math.floor(currentMins / 60);
    if (hour >= 5 && hour < 8) phase = 'dawn';
    else if (hour >= 8 && hour < 17) phase = 'day';
    else if (hour >= 17 && hour < 20) phase = 'dusk';
    else phase = 'night';
  }

  if (weatherData && weatherData.current && weatherData.current.is_day !== undefined) {
    if (weatherData.current.is_day === 0 && phase === 'day') {
      phase = 'night';
    } else if (weatherData.current.is_day === 1 && phase === 'night') {
      phase = 'day';
    }
  }

  return phase;
}
