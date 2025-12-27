type Props = {
	maxWidth?: "4xl" | "7xl";
};

export default function Footer({ maxWidth = "7xl" }: Props) {
	const maxWidthClass = maxWidth === "4xl" ? "max-w-4xl" : "max-w-7xl";

	return (
		<footer className="border-t border-gray-200 bg-amber-50">
			<div
				className={`mx-auto ${maxWidthClass} px-6 py-6 text-center text-xs text-gray-500 sm:px-8`}
			>
				<div className="space-y-2">
					<div>© {new Date().getFullYear()} 初期仏教塾</div>
					<div>
						<a
							className="text-amber-700 hover:text-amber-900 underline transition"
							href="https://www.j-theravada.net/"
							rel="noopener noreferrer"
							target="_blank"
						>
							日本テーラワーダ仏教協会
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
