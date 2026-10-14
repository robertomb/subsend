export function formatDate(date: Date, { short = false } = {}) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: short ? "short" : "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
