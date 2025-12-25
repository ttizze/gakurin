import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { SHEET_URL, parseCSVToTalks } from "../app/lib/talks-csv";
import type { Talk } from "../app/lib/talk-types";

type SerializedTalk = Omit<Talk, "recordedOnDate"> & {
	recordedOnDate: string | null;
};

function serializeTalk(talk: Talk): SerializedTalk {
	return {
		...talk,
		recordedOnDate: talk.recordedOnDate
			? talk.recordedOnDate.toISOString()
			: null,
	};
}

async function main() {
	const response = await fetch(SHEET_URL, {
		headers: { Accept: "text/csv" },
	});
	if (!response.ok) {
		throw new Error(
			`Failed to fetch sheet data: ${response.status} ${response.statusText}`,
		);
	}

	const csv = await response.text();
	const talks = parseCSVToTalks(csv);
	const serialized = talks.map(serializeTalk);

	const outPath = resolve(process.cwd(), "app/generated/talks.json");
	await mkdir(dirname(outPath), { recursive: true });
	await writeFile(outPath, `${JSON.stringify(serialized, null, "\t")}\n`, "utf8");

	console.log(`Wrote ${serialized.length} talks to ${outPath}`);
}

await main();

