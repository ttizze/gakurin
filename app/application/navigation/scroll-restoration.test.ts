import { describe, expect, test } from "bun:test";
import { shouldRestoreScrollOnRouteChange } from "./scroll-restoration";

describe("shouldRestoreScrollOnRouteChange", () => {
	test("popstate 復帰フラグがあれば復元する", () => {
		expect(
			shouldRestoreScrollOnRouteChange({
				pathname: "/about",
				previousPathname: "/talks/abc",
				restoreOnNextRoute: true,
				isTalkGalleryRestorePending: false,
			}),
		).toBe(true);
	});

	test("トーク詳細からホームに戻ると復元する", () => {
		expect(
			shouldRestoreScrollOnRouteChange({
				pathname: "/",
				previousPathname: "/talks/abc",
				restoreOnNextRoute: false,
				isTalkGalleryRestorePending: false,
			}),
		).toBe(true);
	});

	test("ギャラリー復帰待ちのときホームでは復元しない", () => {
		expect(
			shouldRestoreScrollOnRouteChange({
				pathname: "/",
				previousPathname: "/talks/abc",
				restoreOnNextRoute: false,
				isTalkGalleryRestorePending: true,
			}),
		).toBe(false);
	});
});
