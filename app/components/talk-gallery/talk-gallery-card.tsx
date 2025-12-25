import { ExternalLink, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { TalkForDisplay } from "../../page";
import { highlightMatches } from "./highlight";

type Props = {
	talk: TalkForDisplay;
	searchTokens: string[];
};

const SCROLL_Y_STORAGE_KEY = "talkGallery:scrollY";
const SHOULD_RESTORE_STORAGE_KEY = "talkGallery:restore";

export default function TalkGalleryCard({ talk, searchTokens }: Props) {
	return (
		<div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition duration-200 ease-out hover:shadow-md overflow-hidden">
			<Link
				className="group flex flex-col flex-1"
				href={`/talks/${encodeURIComponent(talk.id)}`}
				onClick={() => {
					try {
						sessionStorage.setItem(
							SCROLL_Y_STORAGE_KEY,
							String(window.scrollY),
						);
						sessionStorage.setItem(SHOULD_RESTORE_STORAGE_KEY, "1");
					} catch {
						// Ignore storage failures (private mode, blocked storage, etc).
					}
				}}
			>
				{/* 上半分: サムネイル */}
				{talk.thumbnailUrl && (
					<div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
						<Image
							alt={talk.title || "YouTube thumbnail"}
							className="object-cover transition-transform duration-200 group-hover:scale-105"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							src={talk.thumbnailUrl}
							unoptimized
						/>
					</div>
				)}

				{/* 下半分: データ */}
				<div className="flex flex-col flex-1 p-6">
					<h2 className="text-lg font-bold text-gray-900 sm:text-xl">
						{highlightMatches(talk.title, searchTokens)}
					</h2>
					{talk.subtitle && (
						<p className="mt-2 text-sm leading-relaxed text-gray-600">
							{highlightMatches(talk.subtitle, searchTokens)}
						</p>
					)}
					{talk.summaryPreview && (
						<p className="mt-3 text-sm leading-relaxed text-gray-600">
							{highlightMatches(talk.summaryPreview, searchTokens)}
						</p>
					)}
				</div>
			</Link>

			<div className="px-6 pb-6 flex items-center justify-between gap-3">
				<div className="flex items-baseline gap-2">
					<span className="text-xs text-gray-400">
						{highlightMatches(talk.recordedOnFormatted, searchTokens)}
					</span>
				</div>
				{talk.youtubeUrl && (
					<a
						className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-red-700 sm:text-sm"
						href={talk.youtubeUrl}
						rel="noopener noreferrer"
						target="_blank"
					>
						<Youtube className="h-4 w-4" />
						<span>YouTube</span>
						<ExternalLink className="h-3 w-3" />
					</a>
				)}
			</div>

			{(talk.audioLink || talk.attachmentsLink) && (
				<div className="px-6 pb-6 flex flex-wrap gap-3">
					{talk.audioLink && (
						<a
							className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-gray-800 sm:text-sm"
							href={talk.audioLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							音声を聴く
							<span aria-hidden>↗</span>
						</a>
					)}
					{talk.attachmentsLink && (
						<a
							className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:text-sm"
							href={talk.attachmentsLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							資料を見る
							<span aria-hidden>↗</span>
						</a>
					)}
				</div>
			)}
		</div>
	);
}
