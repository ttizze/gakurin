"use client";

import { useEffect, useId, useState } from "react";
import { GroupedVirtuoso } from "react-virtuoso";
import type { TalkForDisplay } from "../page";
import TalkGalleryRow from "./talk-gallery/talk-gallery-row";
import TalkGallerySectionHeader from "./talk-gallery/talk-gallery-section-header";
import { useTalkGalleryData } from "./talk-gallery/use-talk-gallery-data";

type Props = {
	talks: TalkForDisplay[];
};

const SCROLL_Y_STORAGE_KEY = "talkGallery:scrollY";
const SHOULD_RESTORE_STORAGE_KEY = "talkGallery:restore";

export default function TalkGallery({ talks }: Props) {
	const searchInputId = useId();
	const [searchQuery, setSearchQuery] = useState("");
	const {
		columns,
		filteredTalks,
		sections,
		groups,
		groupCounts,
		flatRows,
		searchTokens,
	} = useTalkGalleryData(talks, "date", searchQuery);

	useEffect(() => {
		try {
			const shouldRestore =
				sessionStorage.getItem(SHOULD_RESTORE_STORAGE_KEY) === "1";

			if (shouldRestore) {
				const storedScrollY = sessionStorage.getItem(SCROLL_Y_STORAGE_KEY);
				const scrollY = storedScrollY ? Number.parseInt(storedScrollY, 10) : 0;

				if (Number.isFinite(scrollY) && scrollY > 0) {
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
						});
					});
				}

				sessionStorage.removeItem(SHOULD_RESTORE_STORAGE_KEY);
			}
		} catch {
			// Ignore storage failures (private mode, blocked storage, etc).
		}

		return () => {
			try {
				sessionStorage.setItem(SCROLL_Y_STORAGE_KEY, String(window.scrollY));
			} catch {
				// Ignore storage failures (private mode, blocked storage, etc).
			}
		};
	}, []);

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
							onChange={(event) => setSearchQuery(event.target.value)}
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
								searchTokens={searchTokens}
								talks={row.talks}
							/>
						);
					}}
					useWindowScroll
				/>
			)}
		</div>
	);
}
