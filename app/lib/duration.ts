/**
 * "1:42:14" or "42:14" → "PT1H42M14S" (ISO 8601 duration)
 */
export function toIsoDuration(raw: string): string | null {
	const parts = raw.split(":").map(Number);
	if (parts.some(Number.isNaN)) return null;

	let h = 0;
	let m = 0;
	let s = 0;
	if (parts.length === 3) {
		[h, m, s] = parts;
	} else if (parts.length === 2) {
		[m, s] = parts;
	} else {
		return null;
	}

	let result = "PT";
	if (h) result += `${h}H`;
	if (m) result += `${m}M`;
	if (s) result += `${s}S`;
	return result === "PT" ? "PT0S" : result;
}
