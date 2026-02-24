import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLHeadingElement>;

export default function SectionHeading({
	className,
	children,
	...rest
}: Props) {
	const classes = ["text-base font-semibold text-amber-900", className]
		.filter(Boolean)
		.join(" ");

	return (
		<h2 className={classes} {...rest}>
			{children}
		</h2>
	);
}
