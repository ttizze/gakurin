import {
	parseScrollPositions,
	readSessionStorage,
	writeSessionStorage,
} from "./storage";

export const SCROLL_POSITIONS_STORAGE_KEY = "scroll:positions:v1";

export function readScrollPositions() {
	return parseScrollPositions(readSessionStorage(SCROLL_POSITIONS_STORAGE_KEY));
}

export function writeScrollPositions(next: Record<string, number>) {
	try {
		writeSessionStorage(SCROLL_POSITIONS_STORAGE_KEY, JSON.stringify(next));
	} catch {
		// Ignore storage failures.
	}
}

export function saveScrollPosition(key: string, scrollY: number) {
	if (!Number.isFinite(scrollY) || scrollY < 0) return;
	const positions = readScrollPositions();
	positions[key] = scrollY;
	writeScrollPositions(positions);
}

export function loadScrollPosition(key: string) {
	const positions = readScrollPositions();
	const value = positions[key];
	return Number.isFinite(value) && value >= 0 ? value : null;
}
