import { describe, expect, test } from "bun:test";
import { parseSrt } from "./parser";

describe("parseSrt", () => {
	test("SRT文字列をキュー配列に変換する", () => {
		const srt = `1
00:00:01,000 --> 00:00:03,500
最初の行

2
00:00:05,000 --> 00:00:07,000
二つ目の行`;

		const result = parseSrt(srt);

		expect(result).toHaveLength(2);
		expect(result[0]).toMatchObject({
			index: 1,
			start: 1,
			end: 3.5,
			startLabel: "00:00:01",
			endLabel: "00:00:03",
			text: "最初の行",
		});
	});

	test("不正なブロックを読み飛ばす", () => {
		const srt = `1
invalid timing
読み飛ばされる

00:00:10,000 --> 00:00:12,000
番号なしでも読める`;

		const result = parseSrt(srt);

		expect(result).toHaveLength(1);
		expect(result[0]?.index).toBe(2);
		expect(result[0]?.text).toBe("番号なしでも読める");
	});
});
