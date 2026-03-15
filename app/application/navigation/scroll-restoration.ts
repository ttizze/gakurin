type Params = {
	pathname: string;
	previousPathname: string | null;
	restoreOnNextRoute: boolean;
	isTalkGalleryRestorePending: boolean;
};

export function shouldRestoreScrollOnRouteChange({
	pathname,
	previousPathname,
	restoreOnNextRoute,
	isTalkGalleryRestorePending,
}: Params): boolean {
	const cameFromTalkDetail = Boolean(previousPathname?.startsWith("/talks/"));
	const goingToHome = pathname === "/";
	const shouldRestore =
		restoreOnNextRoute || (cameFromTalkDetail && goingToHome);

	if (!shouldRestore) {
		return false;
	}

	if (pathname === "/" && isTalkGalleryRestorePending) {
		return false;
	}

	return true;
}
