import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					icons: ['@fortawesome/fontawesome-free/metadata/icon-families.json'],
				},
			},
		},
	},
	assetsInclude: ['**/*.yml'],
});
