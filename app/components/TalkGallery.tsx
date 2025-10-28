'use client';

import { useMemo, useState } from "react";
import type { TalkForDisplay } from "../page";

type ViewMode = "date" | "theme";

type GroupedSection = {
  label: string;
  count: number;
  sortKey: number;
  talks: TalkForDisplay[];
};

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: "date", label: "年代順" },
  { value: "theme", label: "テーマ順" },
];

function buildDecadeSections(talks: TalkForDisplay[]): GroupedSection[] {
  const map = new Map<string, TalkForDisplay[]>();

  talks.forEach((talk) => {
    const bucket = map.get(talk.decadeLabel);
    if (bucket) {
      bucket.push(talk);
    } else {
      map.set(talk.decadeLabel, [talk]);
    }
  });

  return Array.from(map.entries())
    .map(([decadeLabel, groupedTalks]) => {
      const getSortValue = (talk: TalkForDisplay) =>
        talk.recordedOnSortValue > 0
          ? talk.recordedOnSortValue
          : Number.POSITIVE_INFINITY;

      const sortedTalks = groupedTalks
        .slice()
        .sort((a, b) => getSortValue(a) - getSortValue(b));

      const earliest = getSortValue(sortedTalks[0]);

      return {
        label: decadeLabel,
        talks: sortedTalks,
        count: groupedTalks.length,
        sortKey:
          decadeLabel === "年代不明" ? Number.POSITIVE_INFINITY : earliest,
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);
}

function buildThemeSections(talks: TalkForDisplay[]): GroupedSection[] {
  const map = new Map<string, TalkForDisplay[]>();

  talks.forEach((talk) => {
    const key = talk.themeLabel;
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(talk);
    } else {
      map.set(key, [talk]);
    }
  });

  return Array.from(map.entries())
    .map(([themeLabel, groupedTalks]) => {
      const priority = themeLabel === "テーマ未設定" ? 1 : 0;
      return {
        label: themeLabel,
        talks: groupedTalks.sort(
          (a, b) => b.recordedOnSortValue - a.recordedOnSortValue,
        ),
        count: groupedTalks.length,
        sortKey: priority,
      };
    })
    .sort((a, b) => {
      if (a.sortKey !== b.sortKey) {
        return a.sortKey - b.sortKey;
      }
      return a.label.localeCompare(b.label, "ja");
    });
}

type Props = {
  talks: TalkForDisplay[];
};

export default function TalkGallery({ talks }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("date");

  const sections = useMemo(() => {
    if (viewMode === "theme") {
      return buildThemeSections(talks);
    }
    return buildDecadeSections(talks);
  }, [talks, viewMode]);

  if (talks.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-300 backdrop-blur">
        現在表示できるデータがありません。しばらく時間をおいて再度お試しください。
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-medium tracking-[0.2em] text-slate-300 uppercase">
          並び替え
        </h2>
        <div className="inline-flex overflow-hidden rounded-full border border-white/15 bg-black/30 p-1 backdrop-blur">
          {VIEW_MODES.map((mode) => {
            const isActive = viewMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setViewMode(mode.value)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  isActive
                    ? "bg-white/20 text-white shadow shadow-white/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
                aria-pressed={isActive}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {sections.map((section) => (
          <section key={section.label} className="flex flex-col gap-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                {section.label}
              </h3>
              <span className="text-xs text-slate-400">
                {section.count} 件
              </span>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {section.talks.map((talk) => (
                <article
                  key={talk.key}
                  className="group rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/50 transition duration-300 ease-out hover:border-white/20 hover:bg-white/15"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
                      {talk.event}
                    </span>
                    <span className="text-xs text-slate-400">
                      {talk.recordedOnFormatted}
                    </span>
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-white sm:text-xl">
                    {talk.title}
                  </h2>
                  {talk.subtitle && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      {talk.subtitle}
                    </p>
                  )}

                  <dl className="mt-5 space-y-2 text-xs text-slate-300 sm:text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-slate-200">収録場所</dt>
                      <dd className="text-right text-slate-300">
                        {talk.venue}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-slate-200">講師</dt>
                      <dd className="text-right text-slate-300">
                        {talk.speaker}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-slate-200">収録時間</dt>
                      <dd className="text-right text-slate-300">
                        {talk.duration}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-slate-200">言語</dt>
                      <dd className="text-right text-slate-300">
                        {talk.language}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {talk.audioLink && (
                      <a
                        href={talk.audioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/20 sm:text-sm"
                      >
                        音声を聴く
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                    {talk.attachmentsLink && (
                      <a
                        href={talk.attachmentsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-white/40 hover:bg-white/10 sm:text-sm"
                      >
                        資料を見る
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
