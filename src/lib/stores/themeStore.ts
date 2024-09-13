import { persisted } from 'svelte-persisted-store';

type Theme = 'light' | 'dark';

function createThemeStore() {
	const { subscribe, set, update } = persisted<Theme>('theme', 'dark');

	function setTheme(theme: Theme) {
		document.body.classList.remove('light', 'dark');
		document.body.classList.add(theme);
		set(theme);
	}

	return {
		subscribe,
		toggleTheme: () =>
			update((theme) => {
				const newTheme = theme === 'light' ? 'dark' : 'light';
				setTheme(newTheme);
				return newTheme;
			}),
		setTheme,
	};
}

export const themeStore = createThemeStore();

// Initialize theme based on stored preference or system preference
if (typeof window !== 'undefined') {
	themeStore.subscribe((storedTheme) => {
		if (storedTheme) {
			themeStore.setTheme(storedTheme);
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			themeStore.setTheme(prefersDark ? 'dark' : 'light');
		}
	});
}
