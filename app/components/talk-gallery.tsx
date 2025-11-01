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
			<div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-300 backdrop-blur">
				現在表示できるデータがありません。しばらく時間をおいて再度お試しください。
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-6">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<h2 className="text-sm font-medium tracking-[0.2em] text-slate-300 uppercase">
						並び替え
					</h2>
					<div className="inline-flex overflow-hidden rounded-full border border-white/15 bg-black/30 p-1 backdrop-blur">
						{VIEW_MODES.map((mode) => {
							const isActive = viewMode === mode.value;
							return (
								<button
									aria-pressed={isActive}
									className={`rounded-full px-4 py-2 text-xs font-medium transition ${
										isActive
											? "bg-white/20 text-white shadow shadow-white/20"
											: "text-slate-300 hover:bg-white/10 hover:text-white"
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
						className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400"
						htmlFor={searchInputId}
					>
						検索
					</label>
					<div className="relative">
						<input
							className="w-full rounded-full border border-white/15 bg-black/30 py-2.5 px-4 text-sm text-white placeholder:text-slate-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
							id={searchInputId}
							onChange={(event) => setSearchQuery(event.target.value)}
							placeholder="キーワードで検索"
							type="search"
							value={searchQuery}
						/>
						{hasActiveQuery && (
							<button
								className="absolute inset-y-0 right-3 my-auto rounded-full px-2 text-xs font-medium text-slate-400 transition hover:text-white"
								onClick={() => setSearchQuery("")}
								type="button"
							>
								クリア
							</button>
						)}
					</div>
					{hasActiveQuery && (
						<span className="text-xs text-slate-400">
							検索結果 {totalMatched} 件
						</span>
					)}
				</div>
			</div>

			{sections.length === 0 ? (
				<div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-300 backdrop-blur">
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
