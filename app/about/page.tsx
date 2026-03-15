import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/footer";

export const metadata: Metadata = {
	title: "このサイトについて | 初期仏教塾",
	description:
		"初期仏教塾は、お釈迦様の真の教えを現代の言葉で学ぶためのサイトです。",
};

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white text-gray-900">
			<header className="bg-amber-50 px-6 py-8 sm:px-8">
				<div className="mx-auto max-w-4xl">
					<Link
						className="text-sm text-slate-600 transition hover:text-slate-800"
						href="/"
					>
						← トップに戻る
					</Link>
				</div>
			</header>

			<main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
				<section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
					<p className="text-xs font-semibold tracking-[0.08em] text-amber-700">
						（仮）
					</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
						このサイトについて
					</h1>

					<div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700 sm:text-base">
						<p>
							初期仏教塾は、お釈迦様の真の教えを現代の言葉で学べるサイトです。
						</p>
						<p>
							私たちは、仏教を「信じるための宗教」としてではなく、瞑想によって誰にでも確かめられる事実を語った実践の教えとして捉えています。とくにヴィパッサナーと呼ばれる瞑想法は、自分の心と身体を観察しながら真理を体験していくための方法です。
						</p>
						<p>
							日本では長い歴史の中で、この実践的な側面が十分に伝わらず、仏教が誤解されてきた面があります。一方で、スリランカ、タイ、ミャンマーなどの国々では、お釈迦様の教えが現在も生きた実践として受け継がれています。
						</p>
						<p>
							その伝統の中から日本に来られたスマナサーラ長老は、卓越した日本語力で、本来の教えをわかりやすく伝えてくださっています。このサイトでは、長老の法話を通して、「仏教は本来、体験可能な真理を語る教えである」という視点を、現代の言葉で学べるようにしていきます。
						</p>
					</div>
				</section>
			</main>

			<Footer maxWidth="4xl" />
		</div>
	);
}
