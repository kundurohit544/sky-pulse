export function formatTemp(valC, unit = 'c') {
  if (valC === undefined || valC === null || isNaN(valC)) return '--';
  if (unit === 'f') {
    return Math.round((valC * 9 / 5) + 32);
  }
  return Math.round(valC);
}

export function getUnitSymbol(unit = 'c') {
  return unit === 'f' ? '°F' : '°C';
}

export function formatSpeed(kmh, unit = 'c') {
  if (kmh === undefined || kmh === null || isNaN(kmh)) return '--';
  if (unit === 'f') {
    // mph
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}
