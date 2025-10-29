'use client';

import { useId, useMemo, useState } from "react";
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

function normalizeForSearch(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function buildSearchText(talk: TalkForDisplay): string {
  return normalizeForSearch(
    [
      talk.title,
      talk.subtitle,
      talk.event,
      talk.venue,
      talk.speaker,
      talk.language,
      talk.recordedOnFormatted,
      talk.recordedOnRaw,
      talk.decadeLabel,
      talk.themeLabel,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function fuzzyMatch(source: string, query: string): boolean {
  if (!query) {
    return true;
  }

  if (source.includes(query)) {
    return true;
  }

  let cursor = 0;
  for (let i = 0; i < query.length; i += 1) {
    const char = query[i];
    const found = source.indexOf(char, cursor);
    if (found === -1) {
      return false;
    }
    cursor = found + 1;
  }

  return true;
}

type Props = {
  talks: TalkForDisplay[];
};

export default function TalkGallery({ talks }: Props) {
  const searchInputId = useId();
  const [viewMode, setViewMode] = useState<ViewMode>("date");
  const [searchQuery, setSearchQuery] = useState("");

  const indexedTalks = useMemo(
    () =>
      talks.map((talk) => ({
        data: talk,
        searchText: buildSearchText(talk),
      })),
    [talks],
  );

  const filteredTalks = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return indexedTalks.map((item) => item.data);
    }

    const tokens = normalizeForSearch(trimmed)
      .split(" ")
      .filter(Boolean);

    if (tokens.length === 0) {
      return indexedTalks.map((item) => item.data);
    }

    return indexedTalks
      .filter(({ searchText }) =>
        tokens.every((token) => fuzzyMatch(searchText, token)),
      )
      .map(({ data }) => data);
  }, [indexedTalks, searchQuery]);

  const sections = useMemo(() => {
    if (viewMode === "theme") {
      return buildThemeSections(filteredTalks);
    }
    return buildDecadeSections(filteredTalks);
  }, [filteredTalks, viewMode]);

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
        <div className="flex flex-col gap-2">
          <label
            htmlFor={searchInputId}
            className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400"
          >
            検索
          </label>
          <div className="relative">
            <input
              id={searchInputId}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="キーワードで検索"
              className="w-full rounded-full border border-white/15 bg-black/30 py-2.5 px-4 text-sm text-white placeholder:text-slate-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            {hasActiveQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 my-auto rounded-full px-2 text-xs font-medium text-slate-400 transition hover:text-white"
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

      <div className="flex flex-col gap-12">
        {sections.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-300 backdrop-blur">
            {hasActiveQuery
              ? "検索条件に一致するデータが見つかりませんでした。条件を変えてお試しください。"
              : "現在表示できるデータがありません。"}
          </div>
        ) : (
          sections.map((section) => (
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
          ))
        )}
      </div>
    </div>
  );
}
