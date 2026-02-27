import type { TalkGalleryGroup } from "./types";

type Props = {
	groups: TalkGalleryGroup[];
	onJumpToGroup: (groupIndex: number) => void;
};

export default function DecadeJumpNav({ groups, onJumpToGroup }: Props) {
	if (groups.length <= 1) {
		return null;
	}

	return (
		<nav
			aria-label="年代ジャンプ"
			className="scrollbar-none flex gap-3 overflow-x-auto"
		>
			{groups.map((group, index) => (
				<button
					className="shrink-0 text-xs font-medium text-gray-500 underline-offset-4 transition hover:text-gray-900 hover:underline active:text-gray-900"
					key={group.section.label}
					onClick={() => onJumpToGroup(index)}
					type="button"
				>
					{group.section.label}
					<span className="ml-0.5 text-gray-400">({group.section.count})</span>
				</button>
			))}
		</nav>
	);
}
