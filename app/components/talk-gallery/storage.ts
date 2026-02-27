import type { StateSnapshot } from "react-virtuoso";

const TALK_GALLERY_STORAGE_PREFIX = "talkGallery";

export const TALK_GALLERY_VIRTUOSO_STATE_KEY = `${TALK_GALLERY_STORAGE_PREFIX}:virtuosoState:v1`;
export const TALK_GALLERY_RESTORE_PENDING_KEY = `${TALK_GALLERY_STORAGE_PREFIX}:restorePending:v1`;
export const TALK_GALLERY_SEARCH_QUERY_KEY = `${TALK_GALLERY_STORAGE_PREFIX}:searchQuery:v1`;

function readSessionStorage(key: string): string | null {
	try {
		return sessionStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeSessionStorage(key: string, value: string) {
	try {
		sessionStorage.setItem(key, value);
	} catch {
		// Ignore storage failures.
	}
}

function removeSessionStorage(key: string) {
	try {
		sessionStorage.removeItem(key);
	} catch {
		// Ignore storage failures.
	}
}

export function isTalkGalleryRestorePending(): boolean {
	return readSessionStorage(TALK_GALLERY_RESTORE_PENDING_KEY) === "1";
}

export function markTalkGalleryRestorePending() {
	writeSessionStorage(TALK_GALLERY_RESTORE_PENDING_KEY, "1");
}

export function readTalkGallerySearchQuery(): string {
	return readSessionStorage(TALK_GALLERY_SEARCH_QUERY_KEY) ?? "";
}

export function writeTalkGallerySearchQuery(query: string) {
	if (!query) {
		removeSessionStorage(TALK_GALLERY_SEARCH_QUERY_KEY);
		return;
	}
	writeSessionStorage(TALK_GALLERY_SEARCH_QUERY_KEY, query);
}

export function writeTalkGalleryVirtuosoState(snapshot: StateSnapshot) {
	writeSessionStorage(
		TALK_GALLERY_VIRTUOSO_STATE_KEY,
		JSON.stringify(snapshot),
	);
}

export function readAndConsumeTalkGalleryRestoreSnapshot():
	| StateSnapshot
	| undefined {
	if (!isTalkGalleryRestorePending()) {
		return undefined;
	}

	removeSessionStorage(TALK_GALLERY_RESTORE_PENDING_KEY);

	const raw = readSessionStorage(TALK_GALLERY_VIRTUOSO_STATE_KEY);
	removeSessionStorage(TALK_GALLERY_VIRTUOSO_STATE_KEY);
	if (!raw) {
		return undefined;
	}

	try {
		return JSON.parse(raw) as StateSnapshot;
	} catch {
		return undefined;
	}
}
