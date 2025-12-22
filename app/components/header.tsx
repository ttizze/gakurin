export default function Header() {
	return (
		<header className="relative w-full">
			<picture>
				<source media="(max-width: 640px)" srcSet="/hero_smp_3rd_02.jpg" />
				<img
					alt=""
					className="w-full h-auto object-contain"
					src="/hero_pc_3rd_02.jpg"
				/>
			</picture>
		</header>
	);
}
