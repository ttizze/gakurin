"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 400;

export default function ScrollToTopButton() {
	const [isVisible, setIsVisible] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
		updatePreference();
		mediaQuery.addEventListener("change", updatePreference);
		return () => mediaQuery.removeEventListener("change", updatePreference);
	}, []);

	useEffect(() => {
		let ticking = false;

		const onScroll = () => {
			if (ticking) return;
			ticking = true;

			requestAnimationFrame(() => {
				setIsVisible(window.scrollY > SHOW_AFTER_PX);
				ticking = false;
			});
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();

		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div
			className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 transition duration-200 ${isVisible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"}`}
		>
			<a
				className="rounded-full border border-amber-600/30 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-900 shadow-sm shadow-amber-900/10 transition hover:border-amber-700/50 hover:bg-amber-100/70 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
				href="https://docs.google.com/forms/d/e/1FAIpQLSeisb1rR-qiokkmDrJ52Ef_vteXcVL4Y3_lXEuSsqa75bPhiA/viewform?usp=header"
				rel="noopener noreferrer"
				target="_blank"
			>
				ご意見・不具合はこちら
			</a>
			<button
				aria-label="一番上へ"
				className="inline-flex items-center gap-2 rounded-full border border-amber-700/40 bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-amber-900/20 transition hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
				onClick={() => {
					window.scrollTo({
						top: 0,
						behavior: prefersReducedMotion ? "auto" : "smooth",
					});
				}}
				type="button"
			>
				<span aria-hidden="true">↑</span>
				一番上へ
			</button>
		</div>
	);
}
