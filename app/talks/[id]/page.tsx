import { ExternalLink, Youtube } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackToGalleryLink from "../../components/back-to-gallery-link";
import Footer from "../../components/footer";
import { formatJapaneseDate } from "../../lib/date";
import { getTalkById } from "../../lib/talks";
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

	const title =
		talk.title || talk.description || talk.event || "タイトル未設定";
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

	const youtubeUrl = talk.youtubeLink || talk.audioLink;
	const videoId = youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : null;
	const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
	const recordedOnRaw = talk.recordedOn || "日付不明";

	const talkData = {
		id: talk.id,
		dvdId: talk.dvdId,
		title: talk.title || talk.description || talk.event || "タイトル未設定",
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

	return (
		<div className="min-h-screen bg-white text-gray-900">
			<header className="bg-amber-50 px-6 py-8 sm:px-8">
				<div className="mx-auto max-w-4xl">
					<BackToGalleryLink className="text-sm text-slate-600 hover:text-slate-800 transition">
						← トークギャラリーに戻る
					</BackToGalleryLink>
				</div>
			</header>

			<main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
				<div className="space-y-8">
					{/* YouTube動画埋め込み */}
					{talkData.embedUrl && (
						<div className="relative w-full aspect-video bg-gray-100 overflow-hidden rounded-lg">
							<iframe
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="absolute inset-0 h-full w-full"
								src={talkData.embedUrl}
								title={talkData.title}
							/>
						</div>
					)}

					{/* データ情報 */}
					<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<dl className="space-y-4 text-sm">
							<div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
								<dt className="font-medium text-gray-700">DVD番号</dt>
								<dd className="text-right text-gray-600">
									{talkData.dvdId || "—"}
								</dd>
							</div>
							<div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
								<dt className="font-medium text-gray-700">タイトル</dt>
								<dd className="text-right text-gray-600">{talkData.title}</dd>
							</div>
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
						{talkData.summary && (
							<div className="mt-6 pt-6 border-t border-gray-100">
								<p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
									{talkData.summary}
								</p>
							</div>
						)}

						{(talkData.audioLink || talkData.attachmentsLink) && (
							<div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
								{talkData.audioLink && (
									<a
										className="inline-flex items-center gap-2 rounded-full bg-gray-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
										href={talkData.audioLink}
										rel="noopener noreferrer"
										target="_blank"
									>
										音源を聞く
										<span aria-hidden>↗</span>
									</a>
								)}
								{talkData.attachmentsLink && (
									<a
										className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
										href={talkData.attachmentsLink}
										rel="noopener noreferrer"
										target="_blank"
									>
										添付データ
										<span aria-hidden>↗</span>
									</a>
								)}
							</div>
						)}
						{talkData.youtubeUrl && (
							<div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
								<a
									className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
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
					</div>
				</div>
			</main>

			<Footer maxWidth="4xl" />
		</div>
	);
}
