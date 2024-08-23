export function secondsToDaysHours(seconds: number) {
  const days = Math.floor(seconds / 86400); // Calculate full days (1 day = 86400 seconds)
  const remainingSeconds = seconds % 86400; // Remaining seconds after full days
  const hours = Math.floor(remainingSeconds / 3600); // Calculate full hours (1 hour = 3600 seconds)

  return { days, hours };
}
