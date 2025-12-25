"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { GroupedVirtuosoHandle, StateSnapshot } from "react-virtuoso";
import { GroupedVirtuoso } from "react-virtuoso";
import type { TalkForDisplay } from "../page";
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
	const searchInputId = useId();
	const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

	const [searchQuery, setSearchQuery] = useState(() => readStoredSearchQuery());
	const restoreStateFrom = useMemo(() => readAndConsumeRestoreSnapshot(), []);

	const {
		columns,
		filteredTalks,
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

	const hasActiveQuery = searchQuery.trim().length > 0;
	const totalMatched = filteredTalks.length;

	if (talks.length === 0) {
		return (
			<div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600">
				現在表示できるデータがありません。しばらく時間をおいて再度お試しください。
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<label
						className="text-xs font-medium uppercase tracking-wide text-gray-500"
						htmlFor={searchInputId}
					>
						検索
					</label>
					<div className="relative">
						<input
							className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
							id={searchInputId}
							onChange={(event) => {
								const next = event.target.value;
								setSearchQuery(next);
								try {
									sessionStorage.setItem(SEARCH_QUERY_KEY, next);
								} catch {
									// Ignore storage failures.
								}
							}}
							placeholder="キーワードで検索"
							type="search"
							value={searchQuery}
						/>
						{hasActiveQuery && (
							<button
								className="absolute inset-y-0 right-3 my-auto rounded-full px-2 text-xs font-medium text-gray-500 transition hover:text-gray-900"
								onClick={() => setSearchQuery("")}
								type="button"
							>
								クリア
							</button>
						)}
					</div>
					{hasActiveQuery && (
						<span className="text-xs text-gray-500">
							検索結果 {totalMatched} 件
						</span>
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
