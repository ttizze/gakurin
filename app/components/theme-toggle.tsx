"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, toggleTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="inline-flex h-9 w-9 items-center justify-center rounded-full">
				<div className="h-5 w-5" />
			</div>
		);
	}

	return (
		<button
			aria-label="テーマを切り替え"
			className="inline-flex items-center justify-center rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-200/50 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-slate-100"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				toggleTheme();
			}}
			type="button"
		>
			{theme === "light" ? (
				<Moon className="h-5 w-5" />
			) : (
				<Sun className="h-5 w-5" />
			)}
		</button>
	);
}

