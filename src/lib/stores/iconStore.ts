import { writable, type Writable } from 'svelte/store';
import iconFamilies from '@fortawesome/fontawesome-free/metadata/icon-families.json';

export interface Icon {
	name: string;
	label: string;
	unicode: string;
	styles: string[];
	viewBox: [number, number, number, number] | [];
	svgPath: string;
	terms: string[];
}

interface IconStore {
	subscribe: Writable<Icon[]>['subscribe'];
	loadIcons: () => void;
}

function createIconStore(): IconStore {
	const { subscribe, set } = writable<Icon[]>([]);
	let initialized = false;

	const loadIcons = () => {
		if (initialized) return;

		const icons = Object.entries(iconFamilies).map(([name, data]: [string, any]) => {
			const freeStyles = data.familyStylesByLicense.free.map((item: any) => item.style);
			const svgPath = data.svgs?.classic?.[freeStyles[0]]?.path || '';
			const viewBox = data.svgs?.classic?.[freeStyles[0]]?.viewBox || [];
			return {
				name,
				label: data.label,
				unicode: data.unicode,
				styles: freeStyles,
				svgPath,
				viewBox,
				terms: data.search.terms,
			};
		});
		set(icons);
		initialized = true;
	};

	return {
		subscribe: (...args: Parameters<typeof subscribe>) => {
			loadIcons();
			return subscribe(...args);
		},
		loadIcons,
	};
}

export const iconStore = createIconStore();
