"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isTalkGalleryRestorePending } from "./talk-gallery/storage";

type ScrollPositions = Record<string, number>;

const STORAGE_KEY = "scroll:positions:v1";

function readPositions(): ScrollPositions {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw) as unknown;
		if (!parsed || typeof parsed !== "object") return {};
		return parsed as ScrollPositions;
	} catch {
		return {};
	}
}

function writePositions(next: ScrollPositions) {
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	} catch {
		// Ignore storage failures (private mode, blocked storage, etc).
	}
}

function saveScroll(key: string, scrollY: number) {
	if (!Number.isFinite(scrollY) || scrollY < 0) return;
	const positions = readPositions();
	positions[key] = scrollY;
	writePositions(positions);
}

function loadScroll(key: string) {
	const positions = readPositions();
	const value = positions[key];
	return Number.isFinite(value) && value >= 0 ? value : null;
}

function attemptRestoreScroll(targetY: number) {
	let attempts = 0;
	const maxAttempts = 240;

	const tick = () => {
		attempts += 1;

		const maxScrollableY = Math.max(
			0,
			document.documentElement.scrollHeight - window.innerHeight,
		);
		const desiredY = Math.min(targetY, maxScrollableY);

		window.scrollTo({ top: desiredY, left: 0, behavior: "auto" });

		const delta = Math.abs(window.scrollY - desiredY);
		if (delta <= 2) return;
		if (attempts >= maxAttempts) return;

		requestAnimationFrame(tick);
	};

	requestAnimationFrame(tick);
}

export default function ScrollRestoration() {
	const pathname = usePathname();
	const key = pathname;

	const currentKeyRef = useRef<string>(key);
	const scrollYRef = useRef(0);
	const previousPathnameRef = useRef<string | null>(null);
	const restoreOnNextRouteRef = useRef(false);
	const mountedRef = useRef(false);

	useEffect(() => {
		currentKeyRef.current = key;
	}, [key]);

	useEffect(() => {
		try {
			if ("scrollRestoration" in window.history) {
				window.history.scrollRestoration = "manual";
			}
		} catch {
			// Ignore.
		}

		const onPopState = () => {
			restoreOnNextRouteRef.current = true;
		};

		const onScroll = () => {
			scrollYRef.current = window.scrollY;
		};

		const onPageHide = () => {
			saveScroll(currentKeyRef.current, scrollYRef.current);
		};

		const onClickCapture = (event: MouseEvent) => {
			if (event.defaultPrevented) return;
			if (event.button !== 0) return;
			if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
				return;

			const target = event.target;
			if (!(target instanceof Element)) return;

			const anchor = target.closest("a");
			if (!anchor) return;
			if (anchor.target && anchor.target !== "_self") return;
			if (anchor.hasAttribute("download")) return;

			const href = anchor.getAttribute("href");
			if (!href) return;
			if (href.startsWith("#")) return;
			if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

			let url: URL;
			try {
				url = new URL(anchor.href);
			} catch {
				return;
			}
			if (url.origin !== window.location.origin) return;

			saveScroll(currentKeyRef.current, scrollYRef.current);
		};

		window.addEventListener("popstate", onPopState);
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("pagehide", onPageHide);
		document.addEventListener("click", onClickCapture, { capture: true });

		onScroll();

		return () => {
			window.removeEventListener("popstate", onPopState);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("pagehide", onPageHide);
			document.removeEventListener("click", onClickCapture, { capture: true });
		};
	}, []);

	useEffect(() => {
		if (!mountedRef.current) {
			mountedRef.current = true;
			previousPathnameRef.current = pathname;
			return;
		}

		const from = previousPathnameRef.current;
		const to = pathname;

		const cameFromTalkDetail = Boolean(from?.startsWith("/talks/"));
		const goingToHome = to === "/";

		const shouldRestore =
			restoreOnNextRouteRef.current || (cameFromTalkDetail && goingToHome);

		restoreOnNextRouteRef.current = false;
		previousPathnameRef.current = pathname;

		if (!shouldRestore) return;

		if (pathname === "/" && isTalkGalleryRestorePending()) {
			return;
		}

		const saved = loadScroll(key);
		if (saved == null) return;

		setTimeout(() => {
			attemptRestoreScroll(saved);
		}, 0);
	}, [key, pathname]);

	return null;
}
