import Image from "next/image";
import Link from "next/link";
import type { TalkForDisplay } from "../../page";
import { highlightMatches } from "./highlight";

type Props = {
	talk: TalkForDisplay;
	searchTokens: string[];
};

export default function TalkGalleryCard({ talk, searchTokens }: Props) {
	return (
		<Link href={`/talks/${talk.key}`}>
			<article className="group flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition duration-200 ease-out hover:shadow-md overflow-hidden cursor-pointer">
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
				<div className="flex items-baseline justify-between gap-3">
					<span className="text-xs font-medium uppercase tracking-wide text-gray-500">
						{highlightMatches(talk.event, searchTokens)}
					</span>
					<span className="text-xs text-gray-400">
						{highlightMatches(talk.recordedOnFormatted, searchTokens)}
					</span>
				</div>

				<h2 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
					{highlightMatches(talk.title, searchTokens)}
				</h2>
				{talk.subtitle && (
					<p className="mt-2 text-sm leading-relaxed text-gray-600">
						{highlightMatches(talk.subtitle, searchTokens)}
					</p>
				)}

				<dl className="mt-5 space-y-2.5 text-xs text-gray-600 sm:text-sm">
					<div className="flex justify-between gap-4">
						<dt className="font-medium text-gray-700">収録場所</dt>
						<dd className="text-right text-gray-600">
							{highlightMatches(talk.venue, searchTokens)}
						</dd>
					</div>
					<div className="flex justify-between gap-4">
						<dt className="font-medium text-gray-700">講師</dt>
						<dd className="text-right text-gray-600">
							{highlightMatches(talk.speaker, searchTokens)}
						</dd>
					</div>
					<div className="flex justify-between gap-4">
						<dt className="font-medium text-gray-700">収録時間</dt>
						<dd className="text-right text-gray-600">
							{highlightMatches(talk.duration, searchTokens)}
						</dd>
					</div>
					<div className="flex justify-between gap-4">
						<dt className="font-medium text-gray-700">言語</dt>
						<dd className="text-right text-gray-600">
							{highlightMatches(talk.language, searchTokens)}
						</dd>
					</div>
				</dl>

				<div className="mt-6 flex flex-wrap gap-3">
					{talk.youtubeUrl && (
						<a
							className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-red-700 sm:text-sm"
							href={talk.youtubeUrl}
							onClick={(e) => e.stopPropagation()}
							rel="noopener noreferrer"
							target="_blank"
						>
							YouTubeで見る
							<span aria-hidden>↗</span>
						</a>
					)}
					{talk.audioLink && (
						<a
							className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-gray-800 sm:text-sm"
							href={talk.audioLink}
							onClick={(e) => e.stopPropagation()}
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
							onClick={(e) => e.stopPropagation()}
							rel="noopener noreferrer"
							target="_blank"
						>
							資料を見る
							<span aria-hidden>↗</span>
						</a>
					)}
				</div>
			</div>
		</article>
		</Link>
	);
}
