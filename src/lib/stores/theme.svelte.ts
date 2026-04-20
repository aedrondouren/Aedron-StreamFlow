import { browser } from '$app/environment';

const THEME_KEY = 'streamflow:theme';

function getSystemTheme(): 'light' | 'dark' {
	if (!browser) return 'dark';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getInitialTheme(): 'light' | 'dark' | 'system' {
	if (!browser) return 'system';
	return (localStorage.getItem(THEME_KEY) as 'light' | 'dark' | 'system' | null) ?? 'system';
}

export function applyTheme(theme: 'light' | 'dark' | 'system'): 'light' | 'dark' {
	if (browser) {
		document.documentElement.dataset.theme = theme;
		// Update data-system-theme for system theme
		if (theme === 'system') {
			const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.dataset.systemTheme = isDark ? 'dark' : 'light';
		} else {
			delete document.documentElement.dataset.systemTheme;
		}
	}
	const resolved = theme === 'system' ? getSystemTheme() : theme;
	return resolved;
}

export function saveThemePreference(theme: 'light' | 'dark' | 'system') {
	if (browser) {
		localStorage.setItem(THEME_KEY, theme);
	}
}

export function setupSystemThemeListener(
	onThemeChange: (theme: 'light' | 'dark') => void
): () => void {
	if (!browser) return () => {};

	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const handler = () => {
		// Update data-system-theme when theme is system
		const currentTheme = localStorage.getItem('streamflow:theme') || 'system';
		if (currentTheme === 'system') {
			document.documentElement.dataset.systemTheme = getSystemTheme() === 'dark' ? 'dark' : 'light';
		}
		onThemeChange(getSystemTheme());
	};

	mediaQuery.addEventListener('change', handler);
	return () => mediaQuery.removeEventListener('change', handler);
}
