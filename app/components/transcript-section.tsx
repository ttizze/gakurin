"use client";

import { useMemo, useState } from "react";
import {
	buildCueTimeHref,
	buildTranscriptParagraphs,
} from "../application/transcript/presentation";
import type { TranscriptCue } from "../domain/transcript/types";
import { FEEDBACK_FORM_URL } from "../utils/site-links";

type Props = {
	transcript: TranscriptCue[];
	embedUrlPrefix?: string | null;
};

type TranscriptMode = "timeline" | "plain";

const MODE_OPTIONS: Array<{ mode: TranscriptMode; label: string }> = [
	{ mode: "timeline", label: "タイムライン付き" },
	{ mode: "plain", label: "読みやすく" },
];

function getModeButtonClass(isActive: boolean): string {
	return `rounded-full px-3 py-1 transition sm:px-4 sm:py-1.5 ${
		isActive
			? "bg-amber-100 text-amber-900"
			: "text-amber-700 hover:text-amber-900"
	}`;
}

export default function TranscriptSection({
	transcript,
	embedUrlPrefix,
}: Props) {
	const [mode, setMode] = useState<TranscriptMode>("timeline");
	const paragraphs = useMemo(
		() => buildTranscriptParagraphs(transcript),
		[transcript],
	);

	return (
		<div className="mt-6 pt-6 border-t border-gray-100">
			<div className="rounded-lg bg-amber-50/70 px-4 py-3 text-xs text-amber-900 sm:text-sm">
				これはAIの文字起こしを元にしたものです。間違いがある場合は
				<a
					className="ml-1 font-medium underline hover:text-amber-700"
					href={FEEDBACK_FORM_URL}
					rel="noopener noreferrer"
					target="_blank"
				>
					こちら
				</a>
				にご連絡ください。
			</div>

			<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
				<h3 className="text-sm font-semibold text-amber-900 sm:text-base">
					文字起こし
				</h3>
				<div
					aria-label="文字起こしの表示切り替え"
					className="inline-flex rounded-full border border-amber-200 bg-white text-xs font-medium text-amber-900 shadow-sm sm:text-sm"
					role="tablist"
				>
					{MODE_OPTIONS.map((option) => (
						<button
							aria-selected={mode === option.mode}
							className={getModeButtonClass(mode === option.mode)}
							key={option.mode}
							onClick={() => setMode(option.mode)}
							role="tab"
							type="button"
						>
							{option.label}
						</button>
					))}
				</div>
			</div>

			{mode === "timeline" ? (
				<div className="mt-4 space-y-4">
					{transcript.map((cue) => {
						const startSeconds = Math.max(0, Math.floor(cue.start));
						const timeHref = buildCueTimeHref(embedUrlPrefix, startSeconds);
						return (
							<div
								className="grid gap-2 sm:grid-cols-[96px_1fr]"
								key={`${cue.index}-${cue.start}`}
							>
								{timeHref ? (
									<a
										className="text-xs font-semibold text-amber-700 underline transition hover:text-amber-900 sm:text-sm"
										href={timeHref}
										target="talk-player"
									>
										{cue.startLabel}
									</a>
								) : (
									<span className="text-xs font-semibold text-amber-700 sm:text-sm">
										{cue.startLabel}
									</span>
								)}
								<p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
									{cue.text}
								</p>
							</div>
						);
					})}
				</div>
			) : (
				<div className="mt-4 space-y-4">
					{paragraphs.map((paragraph, index) => (
						<p
							className="text-sm leading-relaxed text-gray-700"
							key={`${index}-${paragraph.slice(0, 12)}`}
						>
							{paragraph}
						</p>
					))}
				</div>
			)}
		</div>
	);
}
