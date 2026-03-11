export function normalizeTalkId(value: string): string {
	return value
		.replace(/\uFEFF/g, "")
		.normalize("NFKC")
		.replace(/[‐‑‒–—−ー]/g, "-")
		.replace(/\s+/g, "")
		.toUpperCase();
}
