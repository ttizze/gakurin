import type { StateSnapshot } from "react-virtuoso";
import {
	parseVirtuosoRestoreSnapshot,
	readSessionStorage,
	removeSessionStorage,
	writeSessionStorage,
} from "./storage";

const TALK_GALLERY_STORAGE_PREFIX = "talkGallery";

export const TALK_GALLERY_VIRTUOSO_STATE_KEY = `${TALK_GALLERY_STORAGE_PREFIX}:virtuosoState:v1`;
export const TALK_GALLERY_RESTORE_PENDING_KEY = `${TALK_GALLERY_STORAGE_PREFIX}:restorePending:v1`;
export const TALK_GALLERY_SEARCH_QUERY_KEY = `${TALK_GALLERY_STORAGE_PREFIX}:searchQuery:v1`;

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
	const isRestorePending = isTalkGalleryRestorePending();
	if (!isRestorePending) {
		return undefined;
	}

	removeSessionStorage(TALK_GALLERY_RESTORE_PENDING_KEY);

	const raw = readSessionStorage(TALK_GALLERY_VIRTUOSO_STATE_KEY);
	removeSessionStorage(TALK_GALLERY_VIRTUOSO_STATE_KEY);

	return parseVirtuosoRestoreSnapshot(raw, isRestorePending);
}
