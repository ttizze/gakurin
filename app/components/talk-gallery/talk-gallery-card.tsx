import type { TalkForDisplay } from "../../page";
import { highlightMatches } from "./highlight";

type Props = {
	talk: TalkForDisplay;
	searchTokens: string[];
};

export default function TalkGalleryCard({ talk, searchTokens }: Props) {
	return (
		<article className="group rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/50 transition duration-300 ease-out hover:border-white/20 hover:bg-white/15">
			<div className="flex items-baseline justify-between gap-3">
				<span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
					{highlightMatches(talk.event, searchTokens)}
				</span>
				<span className="text-xs text-slate-400">
					{highlightMatches(talk.recordedOnFormatted, searchTokens)}
				</span>
			</div>

			<h2 className="mt-4 text-lg font-semibold text-white sm:text-xl">
				{highlightMatches(talk.title, searchTokens)}
			</h2>
			{talk.subtitle && (
				<p className="mt-2 text-sm leading-relaxed text-slate-200">
					{highlightMatches(talk.subtitle, searchTokens)}
				</p>
			)}

			<dl className="mt-5 space-y-2 text-xs text-slate-300 sm:text-sm">
				<div className="flex justify-between gap-4">
					<dt className="font-medium text-slate-200">収録場所</dt>
					<dd className="text-right text-slate-300">
						{highlightMatches(talk.venue, searchTokens)}
					</dd>
				</div>
				<div className="flex justify-between gap-4">
					<dt className="font-medium text-slate-200">講師</dt>
					<dd className="text-right text-slate-300">
						{highlightMatches(talk.speaker, searchTokens)}
					</dd>
				</div>
				<div className="flex justify-between gap-4">
					<dt className="font-medium text-slate-200">収録時間</dt>
					<dd className="text-right text-slate-300">
						{highlightMatches(talk.duration, searchTokens)}
					</dd>
				</div>
				<div className="flex justify-between gap-4">
					<dt className="font-medium text-slate-200">言語</dt>
					<dd className="text-right text-slate-300">
						{highlightMatches(talk.language, searchTokens)}
					</dd>
				</div>
			</dl>

			<div className="mt-6 flex flex-wrap gap-3">
				{talk.audioLink && (
					<a
						className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/20 sm:text-sm"
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
						className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-white/40 hover:bg-white/10 sm:text-sm"
						href={talk.attachmentsLink}
						rel="noopener noreferrer"
						target="_blank"
					>
						資料を見る
						<span aria-hidden>↗</span>
					</a>
				)}
			</div>
		</article>
	);
}
