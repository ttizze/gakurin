import type { MetadataRoute } from "next";
import { getTalks } from "./lib/talks";

const BASE = "https://early-buddhism.j-theravada.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{ url: BASE, changeFrequency: "weekly", priority: 1 },
		{ url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.7 },
		{
			url: `${BASE}/about/sumanasara`,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE}/about/early-buddhism`,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE}/about/vipassana`,
			changeFrequency: "monthly",
			priority: 0.7,
		},
	];

	const talks = await getTalks();
	const talkPages: MetadataRoute.Sitemap = talks.map((talk) => ({
		url: `${BASE}/talks/${talk.id}`,
		...(talk.recordedOnDate && { lastModified: talk.recordedOnDate }),
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	return [...staticPages, ...talkPages];
}
