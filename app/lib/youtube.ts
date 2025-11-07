export function extractYouTubeVideoId(url: string): string | null {
	const trimmed = url.trim();
	if (!trimmed) {
		return null;
	}

	// https://youtu.be/VIDEO_ID または https://youtu.be/VIDEO_ID?si=...
	const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
	if (shortMatch) {
		return shortMatch[1];
	}

	// https://www.youtube.com/watch?v=VIDEO_ID または https://youtube.com/watch?v=VIDEO_ID
	const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
	if (watchMatch) {
		return watchMatch[1];
	}

	return null;
}

export function getYouTubeThumbnailUrl(videoId: string): string {
	return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeInfo(url: string | null): {
	youtubeUrl: string | null;
	thumbnailUrl: string | null;
} {
	if (!url) {
		return { youtubeUrl: null, thumbnailUrl: null };
	}

	const videoId = extractYouTubeVideoId(url);
	if (!videoId) {
		return { youtubeUrl: null, thumbnailUrl: null };
	}

	return {
		youtubeUrl: url,
		thumbnailUrl: getYouTubeThumbnailUrl(videoId),
	};
}
