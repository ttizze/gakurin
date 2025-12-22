import Image from "next/image";

export default function Header() {
	return (
		<header className="relative w-full">
			{/* モバイル用画像 */}
			<div className="relative w-full sm:hidden">
				<Image
					alt=""
					className="w-full h-auto object-contain"
					height={400}
					priority
					sizes="100vw"
					src="/hero_smp_3rd_02.jpg"
					width={640}
				/>
			</div>
			{/* PC用画像 */}
			<div className="relative hidden w-full sm:block">
				<Image
					alt=""
					className="w-full h-auto object-contain"
					height={800}
					priority
					sizes="100vw"
					src="/hero_pc_3rd_02.jpg"
					width={1280}
				/>
			</div>
		</header>
	);
}
