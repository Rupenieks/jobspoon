import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes, ThemeName } from '@/styles/themes';

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: ThemeName;
};

type ThemeContextType = {
	theme: ThemeName;
	setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = 'default' }: ThemeProviderProps) {
	const [theme, setTheme] = useState<ThemeName>(defaultTheme);

	useEffect(() => {
		const root = window.document.documentElement;
		const themeColors = themes[theme];

		Object.entries(themeColors).forEach(([property, value]) => {
			root.style.setProperty(property, value);
		});
	}, [theme]);

	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
