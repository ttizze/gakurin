"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// ローカルストレージからテーマを読み込む
		const savedTheme = localStorage.getItem("theme") as Theme | null;
		let initialTheme: Theme = "light";
		
		if (savedTheme) {
			initialTheme = savedTheme;
		} else {
			// システムの設定を確認
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			initialTheme = prefersDark ? "dark" : "light";
		}

		// 即座にHTMLクラスを適用
		if (initialTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		setTheme(initialTheme);
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		// HTMLタグにクラスを追加/削除
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		// ローカルストレージに保存
		localStorage.setItem("theme", theme);
	}, [theme, mounted]);

	const toggleTheme = useCallback(() => {
		setTheme((prev) => {
			const newTheme = prev === "light" ? "dark" : "light";
			// 即座にDOMを更新
			if (typeof document !== "undefined") {
				if (newTheme === "dark") {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}
				// ローカルストレージに保存
				localStorage.setItem("theme", newTheme);
			}
			return newTheme;
		});
	}, []);

	const value = useMemo(
		() => ({ theme, toggleTheme }),
		[theme, toggleTheme],
	);

	// 常にProviderを返す（初期値としてlightを使用）
	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

