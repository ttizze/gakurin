export type Talk = {
	id: string;
	folder: string;
	event: string;
	venue: string;
	recordedOn: string;
	recordedOnDate: Date | null;
	duration: string;
	title: string;
	description: string;
	speaker: string;
	language: string;
	format: string;
	audioLink: string | null;
	attachmentsLink: string | null;
	youtubeLink: string | null;
	summary: string;
};
