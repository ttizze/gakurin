import { ExternalLink, Youtube } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackToGalleryLink from "../../components/back-to-gallery-link";
import ContentCard from "../../components/content-card";
import Footer from "../../components/footer";
import TranscriptSection from "../../components/transcript-section";
import { formatJapaneseDate } from "../../lib/date";
import { getPrimaryTalkMediaUrl, getTalkTitle } from "../../lib/talk-display";
import { getTalkById } from "../../lib/talks";
import { getTranscriptByTalkId } from "../../lib/transcripts";
import { extractYouTubeVideoId } from "../../lib/youtube";

type Props = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const talk = await getTalkById(id);

	if (!talk) {
		return {
			title: "トークが見つかりません | 初期仏教塾",
		};
	}

	const title = getTalkTitle(talk);
	const description =
		talk.summary ||
		talk.description ||
		"初期仏教の法話を静かに味わうアーカイブ";

	return {
		title: `${title} | 初期仏教塾`,
		description,
	};
}

export default async function TalkDetailPage({ params }: Props) {
	const { id } = await params;

	const talk = await getTalkById(id);

	if (!talk) {
		notFound();
	}

	const youtubeUrl = getPrimaryTalkMediaUrl(talk);
	const videoId = youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : null;
	const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
	const recordedOnRaw = talk.recordedOn || "日付不明";

	const talkData = {
		id: talk.id,
		dvdId: talk.dvdId,
		title: getTalkTitle(talk),
		description: talk.description,
		summary: talk.summary,
		event: talk.event || "未分類",
		venue: talk.venue || "—",
		speaker: talk.speaker || "—",
		duration: talk.duration || "—",
		language: talk.language || "—",
		recordedOn: formatJapaneseDate(talk.recordedOnDate, recordedOnRaw),
		youtubeUrl,
		embedUrl,
		audioLink: talk.audioLink,
		attachmentsLink: talk.attachmentsLink,
	};
	const detailRows = [
		{ label: "DVD番号", value: talkData.dvdId || "—" },
		{ label: "タイトル", value: talkData.title },
		{ label: "行事名", value: talkData.event },
		{ label: "収録場所", value: talkData.venue },
		{ label: "講師", value: talkData.speaker },
		{ label: "収録時間", value: talkData.duration },
		{ label: "言語", value: talkData.language },
		{ label: "収録日", value: talkData.recordedOn },
	];
	const resourceLinks = [
		talkData.audioLink
			? {
					label: "音源を聞く",
					href: talkData.audioLink,
					className:
						"inline-flex items-center gap-2 rounded-full bg-gray-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700",
				}
			: null,
		talkData.attachmentsLink
			? {
					label: "添付データ",
					href: talkData.attachmentsLink,
					className:
						"inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700",
				}
			: null,
	].filter(
		(
			link,
		): link is { label: string; href: string; className: string } =>
			link !== null,
	);
	const transcript = await getTranscriptByTalkId(talk.id);
	const embedUrlPrefix = talkData.embedUrl
		? `${talkData.embedUrl}${talkData.embedUrl.includes("?") ? "&" : "?"}`
		: null;

	return (
		<div className="min-h-screen bg-white text-gray-900 flex flex-col">
			<header className="bg-amber-50 px-6 py-8 sm:px-8">
				<div className="mx-auto max-w-4xl">
					<BackToGalleryLink className="text-sm text-slate-600 hover:text-slate-800 transition">
						← トークギャラリーに戻る
					</BackToGalleryLink>
				</div>
			</header>

			<main className="mx-auto max-w-4xl px-6 py-12 sm:px-8 flex-1">
				<div className="space-y-8">
					{/* YouTube動画埋め込み */}
					{talkData.embedUrl && (
						<div className="relative w-full aspect-video bg-gray-100 overflow-hidden rounded-lg">
							<iframe
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="absolute inset-0 h-full w-full"
								name="talk-player"
								src={talkData.embedUrl}
								title={talkData.title}
							/>
						</div>
					)}

					{/* データ情報 */}
					<ContentCard as="div">
						<dl className="space-y-4 text-sm">
							{detailRows.map((row, index) => {
								const isLast = index === detailRows.length - 1;
								return (
									<div
										className={`flex justify-between gap-4 ${isLast ? "" : "border-b border-gray-100 pb-4"}`}
										key={row.label}
									>
										<dt className="font-medium text-gray-700">{row.label}</dt>
										<dd className="text-right text-gray-600">{row.value}</dd>
									</div>
								);
							})}
						</dl>

						{talkData.description && (
							<div className="mt-6 pt-6 border-t border-gray-100">
								<p className="text-sm leading-relaxed text-gray-700">
									{talkData.description}
								</p>
							</div>
						)}
						{talkData.summary && (
							<div className="mt-6 pt-6 border-t border-gray-100">
								<p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
									{talkData.summary}
								</p>
							</div>
						)}

						{transcript && transcript.length > 0 && (
							<TranscriptSection
								embedUrlPrefix={embedUrlPrefix}
								transcript={transcript}
							/>
						)}

						{resourceLinks.length > 0 && (
							<div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
								{resourceLinks.map((link) => (
									<a
										className={link.className}
										href={link.href}
										key={link.label}
										rel="noopener noreferrer"
										target="_blank"
									>
										{link.label}
										<span aria-hidden>↗</span>
									</a>
								))}
							</div>
						)}
						{talkData.youtubeUrl && (
							<div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
								<a
									className="inline-flex items-center gap-2 rounded-full border border-red-500 bg-white px-6 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
									href={talkData.youtubeUrl}
									rel="noopener noreferrer"
									target="_blank"
								>
									<Youtube className="h-5 w-5" />
									<span>YouTube</span>
									<ExternalLink className="h-4 w-4" />
								</a>
							</div>
						)}
					</ContentCard>
				</div>
			</main>

			<Footer maxWidth="4xl" />
		</div>
	);
}
