import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	SAMPLE_TALK_DATA,
	SAMPLE_TRANSCRIPTS,
	SAMPLE_YOUTUBE_VIDEOS,
} from "../../lib/sample-data";
import { getYouTubeInfo } from "../../lib/youtube";

type Props = {
	params: Promise<{ key: string }>;
};

export default async function TalkDetailPage({ params }: Props) {
	const { key } = await params;

	// サンプルデータの情報を取得
	const isSample = key in SAMPLE_YOUTUBE_VIDEOS;
	if (!isSample) {
		notFound();
	}

	const youtubeUrl =
		SAMPLE_YOUTUBE_VIDEOS[key as keyof typeof SAMPLE_YOUTUBE_VIDEOS];
	const { thumbnailUrl } = getYouTubeInfo(youtubeUrl);
	const talkInfo = SAMPLE_TALK_DATA[key as keyof typeof SAMPLE_TALK_DATA];

	const talkData = {
		key,
		title: talkInfo.title,
		description: talkInfo.description,
		event: "サンプル講演",
		venue: "オンライン",
		speaker: "サンプル講師",
		duration: talkInfo.duration,
		language: "日本語",
		recordedOn: "日付不明",
		youtubeUrl,
		thumbnailUrl,
		transcript: SAMPLE_TRANSCRIPTS[key] || "",
	};

	return (
		<div className="min-h-screen bg-white text-gray-900">
			<header className="border-b border-orange-700 bg-orange-600">
				<div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-8 sm:px-8">
					<Link
						className="text-sm text-orange-100 hover:text-white transition"
						href="/"
					>
						← トークギャラリーに戻る
					</Link>
					<div>
						<span className="text-xs uppercase tracking-[0.3em] text-orange-100">
							GAKURIN
						</span>
						<h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
							{talkData.title}
						</h1>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
				<div className="space-y-8">
					{/* サムネイル */}
					{talkData.thumbnailUrl && (
						<div className="relative w-full aspect-video bg-gray-100 overflow-hidden rounded-lg">
							{talkData.youtubeUrl && (
								<a
									className="block w-full h-full"
									href={talkData.youtubeUrl}
									rel="noopener noreferrer"
									target="_blank"
								>
									<Image
										alt={talkData.title}
										className="object-cover"
										fill
										sizes="100vw"
										src={talkData.thumbnailUrl}
										unoptimized
									/>
								</a>
							)}
						</div>
					)}

					{/* データ情報 */}
					<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<dl className="space-y-4 text-sm">
							<div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
								<dt className="font-medium text-gray-700">行事名</dt>
								<dd className="text-right text-gray-600">{talkData.event}</dd>
							</div>
							<div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
								<dt className="font-medium text-gray-700">収録場所</dt>
								<dd className="text-right text-gray-600">{talkData.venue}</dd>
							</div>
							<div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
								<dt className="font-medium text-gray-700">講師</dt>
								<dd className="text-right text-gray-600">{talkData.speaker}</dd>
							</div>
							<div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
								<dt className="font-medium text-gray-700">収録時間</dt>
								<dd className="text-right text-gray-600">
									{talkData.duration}
								</dd>
							</div>
							<div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
								<dt className="font-medium text-gray-700">言語</dt>
								<dd className="text-right text-gray-600">
									{talkData.language}
								</dd>
							</div>
							<div className="flex justify-between gap-4">
								<dt className="font-medium text-gray-700">収録日</dt>
								<dd className="text-right text-gray-600">
									{talkData.recordedOn}
								</dd>
							</div>
						</dl>

						{talkData.description && (
							<div className="mt-6 pt-6 border-t border-gray-100">
								<p className="text-sm leading-relaxed text-gray-700">
									{talkData.description}
								</p>
							</div>
						)}

						{talkData.youtubeUrl && (
							<div className="mt-6 pt-6 border-t border-gray-100">
								<a
									className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
									href={talkData.youtubeUrl}
									rel="noopener noreferrer"
									target="_blank"
								>
									YouTubeで見る
									<span aria-hidden>↗</span>
								</a>
							</div>
						)}
					</div>

					{/* 全文文字起こし */}
					{talkData.transcript && (
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
							<h2 className="mb-4 text-lg font-bold text-gray-900">
								全文文字起こし
							</h2>
							<div className="prose prose-sm max-w-none">
								<pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
									{talkData.transcript}
								</pre>
							</div>
						</div>
					)}
				</div>
			</main>

			<footer className="border-t border-gray-200 bg-gray-50">
				<div className="mx-auto max-w-4xl px-6 py-6 text-center text-xs text-gray-500 sm:px-8">
					© {new Date().getFullYear()} 学林 — 初期仏教音声アーカイブ
				</div>
			</footer>
		</div>
	);
}
