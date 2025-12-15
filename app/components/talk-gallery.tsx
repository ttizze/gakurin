"use client";

import { useId, useState } from "react";
import { GroupedVirtuoso } from "react-virtuoso";
import type { TalkForDisplay } from "../page";
import TalkGalleryRow from "./talk-gallery/talk-gallery-row";
import TalkGallerySectionHeader from "./talk-gallery/talk-gallery-section-header";
import type { ViewMode } from "./talk-gallery/types";
import { useTalkGalleryData } from "./talk-gallery/use-talk-gallery-data";

const VIEW_MODES: { value: ViewMode; label: string }[] = [
	{ value: "date", label: "年代順" },
	{ value: "theme", label: "テーマ順" },
];

type Props = {
	talks: TalkForDisplay[];
};

export default function TalkGallery({ talks }: Props) {
	const searchInputId = useId();
	const [viewMode, setViewMode] = useState<ViewMode>("date");
	const [searchQuery, setSearchQuery] = useState("");
	const {
		columns,
		filteredTalks,
		sections,
		groups,
		groupCounts,
		flatRows,
		searchTokens,
	} = useTalkGalleryData(talks, viewMode, searchQuery);

	const hasActiveQuery = searchQuery.trim().length > 0;
	const totalMatched = filteredTalks.length;

	if (talks.length === 0) {
		return (
			<div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
				現在表示できるデータがありません。しばらく時間をおいて再度お試しください。
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-6">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<h2 className="text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300 uppercase">
						並び替え
					</h2>
					<div className="inline-flex overflow-hidden rounded-full border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
						{VIEW_MODES.map((mode) => {
							const isActive = viewMode === mode.value;
							return (
								<button
									aria-pressed={isActive}
									className={`rounded-full px-5 py-2 text-sm font-medium transition ${
										isActive
											? "bg-gray-900 text-white dark:bg-gray-600 dark:text-white"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
									}`}
									key={mode.value}
									onClick={() => setViewMode(mode.value)}
									type="button"
								>
									{mode.label}
								</button>
							);
						})}
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<label
						className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
						htmlFor={searchInputId}
					>
						検索
					</label>
					<div className="relative">
						<input
							className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-500/10"
							id={searchInputId}
							onChange={(event) => setSearchQuery(event.target.value)}
							placeholder="キーワードで検索"
							type="search"
							value={searchQuery}
						/>
						{hasActiveQuery && (
							<button
								className="absolute inset-y-0 right-3 my-auto rounded-full px-2 text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
								onClick={() => setSearchQuery("")}
								type="button"
							>
								クリア
							</button>
						)}
					</div>
					{hasActiveQuery && (
						<span className="text-xs text-gray-500 dark:text-gray-400">
							検索結果 {totalMatched} 件
						</span>
					)}
				</div>
			</div>

			{sections.length === 0 ? (
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
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
