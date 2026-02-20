"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GroupedVirtuosoHandle, StateSnapshot } from "react-virtuoso";
import { GroupedVirtuoso } from "react-virtuoso";
import type { TalkForDisplay } from "../lib/talk-display";
import DecadeJumpNav from "./talk-gallery/decade-jump-nav";
import PresetSearchTags from "./talk-gallery/preset-search-tags";
import TalkGalleryRow from "./talk-gallery/talk-gallery-row";
import TalkGallerySectionHeader from "./talk-gallery/talk-gallery-section-header";
import { useTalkGalleryData } from "./talk-gallery/use-talk-gallery-data";

type Props = {
	talks: TalkForDisplay[];
};

const VIRTUOSO_STATE_KEY = "talkGallery:virtuosoState:v1";
const RESTORE_PENDING_KEY = "talkGallery:restorePending:v1";
const SEARCH_QUERY_KEY = "talkGallery:searchQuery:v1";

function readAndConsumeRestoreSnapshot(): StateSnapshot | undefined {
	try {
		const pending = sessionStorage.getItem(RESTORE_PENDING_KEY) === "1";
		if (!pending) return undefined;

		sessionStorage.removeItem(RESTORE_PENDING_KEY);

		const raw = sessionStorage.getItem(VIRTUOSO_STATE_KEY);
		sessionStorage.removeItem(VIRTUOSO_STATE_KEY);
		if (!raw) return undefined;

		return JSON.parse(raw) as StateSnapshot;
	} catch {
		return undefined;
	}
}

function readStoredSearchQuery(): string {
	try {
		return sessionStorage.getItem(SEARCH_QUERY_KEY) ?? "";
	} catch {
		return "";
	}
}

export default function TalkGallery({ talks }: Props) {
	const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

	const [searchQuery, setSearchQuery] = useState(() => readStoredSearchQuery());
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const restoreStateFrom = useMemo(() => readAndConsumeRestoreSnapshot(), []);

	useEffect(() => {
		const handleScrollToTop = () => {
			virtuosoRef.current?.scrollToIndex({
				index: 0,
				align: "start",
			});
		};
		window.addEventListener("app:scroll-to-top", handleScrollToTop);
		return () =>
			window.removeEventListener("app:scroll-to-top", handleScrollToTop);
	}, []);

	const {
		columns,
		filteredTalks,
		indexedTalks,
		sections,
		groups,
		groupCounts,
		flatRows,
		searchTokens,
	} = useTalkGalleryData(talks, "date", searchQuery);

	const handleNavigateToTalk = () => {
		try {
			sessionStorage.setItem(RESTORE_PENDING_KEY, "1");
			sessionStorage.setItem(SEARCH_QUERY_KEY, searchQuery);
		} catch {
			// Ignore storage failures.
		}

		virtuosoRef.current?.getState((snapshot) => {
			try {
				sessionStorage.setItem(VIRTUOSO_STATE_KEY, JSON.stringify(snapshot));
			} catch {
				// Ignore storage failures.
			}
		});
	};

	const handleJumpToGroup = (groupIndex: number) => {
		if (groupIndex === 0) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}
		virtuosoRef.current?.scrollToIndex({
			groupIndex,
			align: "start",
			behavior: "smooth",
		});
	};

	const handleSelectTag = (keyword: string) => {
		setSearchQuery(keyword);
		try {
			sessionStorage.setItem(SEARCH_QUERY_KEY, keyword);
		} catch {
			// Ignore storage failures.
		}
	};

	const hasActiveQuery = searchQuery.trim().length > 0;
	const totalMatched = filteredTalks.length;
	const showPresetTags = isSearchFocused && !hasActiveQuery;

	if (talks.length === 0) {
		return (
			<div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600">
				現在表示できるデータがありません。しばらく時間をおいて再度お試しください。
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="sticky top-0 z-10 -mx-6 bg-white/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
				<div className="flex flex-col gap-2">
					<div className="relative">
						<input
							className="search-cancel-none w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
							onBlur={() => {
								// Delay to allow tag click to fire before hiding
								setTimeout(() => setIsSearchFocused(false), 150);
							}}
							onChange={(event) => {
								const next = event.target.value;
								setSearchQuery(next);
								try {
									sessionStorage.setItem(SEARCH_QUERY_KEY, next);
								} catch {
									// Ignore storage failures.
								}
							}}
							onFocus={() => setIsSearchFocused(true)}
							placeholder="キーワードで検索"
							type="search"
							value={searchQuery}
						/>
						{hasActiveQuery && (
							<button
								aria-label="検索をクリア"
								className="absolute inset-y-0 right-3 my-auto flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-900"
								onClick={() => {
									setSearchQuery("");
									try {
										sessionStorage.removeItem(SEARCH_QUERY_KEY);
									} catch {
										// Ignore storage failures.
									}
								}}
								type="button"
							>
								<svg
									aria-hidden="true"
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
								>
									<path
										d="M6 6l12 12M6 18L18 6"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						)}
					</div>
					{hasActiveQuery && (
						<span className="text-xs text-gray-500">
							検索結果 {totalMatched} 件
						</span>
					)}
					{showPresetTags && (
						<PresetSearchTags
							indexedTalks={indexedTalks}
							onSelectTag={handleSelectTag}
						/>
					)}
					{!hasActiveQuery && (
						<DecadeJumpNav
							groups={groups}
							onJumpToGroup={handleJumpToGroup}
						/>
					)}
				</div>
			</div>

			{sections.length === 0 ? (
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600">
					{hasActiveQuery
						? "検索条件に一致するデータが見つかりませんでした。条件を変えてお試しください。"
						: "現在表示できるデータがありません。"}
				</div>
			) : (
				<GroupedVirtuoso
					groupContent={(groupIndex) => {
						const group = groups[groupIndex];
						if (!group) {
							return null;
						}
						return (
							<TalkGallerySectionHeader
								isFirst={groupIndex === 0}
								searchTokens={searchTokens}
								section={group.section}
							/>
						);
					}}
					groupCounts={groupCounts}
					increaseViewportBy={{ top: 400, bottom: 600 }}
					itemContent={(itemIndex) => {
						const row = flatRows[itemIndex];
						if (!row) {
							return null;
						}
						return (
							<TalkGalleryRow
								columns={columns}
								isFirstRow={row.rowIndex === 0}
								onNavigateToTalk={handleNavigateToTalk}
								searchTokens={searchTokens}
								talks={row.talks}
							/>
						);
					}}
					ref={virtuosoRef}
					restoreStateFrom={restoreStateFrom}
					useWindowScroll
				/>
			)}
		</div>
	);
}
