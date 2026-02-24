import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & {
	as?: "section" | "div";
};

export default function ContentCard({
	as = "section",
	className,
	children,
	...rest
}: Props) {
	const classes = [
		"rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
		className,
	]
		.filter(Boolean)
		.join(" ");
	const Tag = as;

	return (
		<Tag className={classes} {...rest}>
			{children}
		</Tag>
	);
}
