<!-- @component
	Props:
	- anchorElement: HTMLElement
	- onSelectIcon: (icon: string) => void
	- isOpen: boolean

	A component that displays a popup with a grid of icons that can be selected. On selection, the onSelectIcon callback is called with the name of the selected icon.
	The icons are sourced from the iconStore.
 -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Popup from './Popup.svelte';
	import { iconStore, type Icon } from '../../stores/iconStore';
	import { themeStore } from '../../stores/themeStore';

	export let anchorElement: HTMLElement | null = null;
	export let onSelectIcon: (icon: string) => void = () => {};
	export let isOpen: boolean = false;

	let icons: Icon[] = [];
	let searchTerm: string = '';
	let isLoaded: boolean = false;

	onMount(() => {
		const unsubscribe = iconStore.subscribe((value) => {
			icons = value;
			isLoaded = value.length > 0;
		});

		if (!isLoaded) {
			iconStore.loadIcons();
		}

		return unsubscribe;
	});

	$: filteredIcons = isLoaded
		? icons.filter(
				(icon) =>
					(icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
						icon.terms.some((term) => term.toLowerCase().includes(searchTerm.toLowerCase())) ||
						icon.label.toLowerCase().includes(searchTerm.toLowerCase())) &&
					icon.styles.includes('solid')
			)
		: [];

	function handleSelectIcon(icon: Icon): void {
		onSelectIcon(icon.name);
		isOpen = false;
	}

	function closePopup() {
		isOpen = false;
	}
</script>

<Popup bind:isOpen {anchorElement}>
	<div class="icon-picker {$themeStore}">
		<div class="icon-picker-header">
			<input type="text" bind:value={searchTerm} placeholder="Search icons..." class="search-input" />
			<button class="close-button" on:click={closePopup}>×</button>
		</div>
		<div class="icons-grid-container">
			<div class="icons-grid">
				{#if isLoaded}
					{#each filteredIcons as icon}
						<button on:click={() => handleSelectIcon(icon)} class="icon-button" title={icon.label}>
							<svg
								viewBox={icon.viewBox.toString()}
								class="icon-svg"
								aria-hidden="true"
								focusable="false"
							>
								<path fill="currentColor" d={icon.svgPath} />
							</svg>
						</button>
					{/each}
				{:else}
					<p>Loading icons...</p>
				{/if}
			</div>
		</div>
	</div>
</Popup>

<style>
	.icon-picker {
		display: flex;
		flex-direction: column;
		background-color: var(--card-bg-color);
		border-radius: var(--border-radius);
		width: 300px;
		height: 400px;
		color: var(--text-color);
	}

	.icon-picker-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.close-button {
		background: none;
		border: none;
		color: var(--icon-color);
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem;
		line-height: 1;
	}

	.search-input {
		flex-grow: 1;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.9rem;
		background-color: var(--input-bg-color);
		color: var(--text-color);
	}

	.search-input::placeholder {
		color: var(--text-color);
		opacity: 0.6;
	}

	.icons-grid-container {
		flex-grow: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.icons-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
		gap: 0.5rem;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		cursor: pointer;
		transition: all 0.2s;
		background-color: var(--input-bg-color);
		aspect-ratio: 1 / 1;
	}

	.icon-button:hover {
		background-color: var(--hover-bg-color);
		transform: translateY(-2px);
		box-shadow: 0 2px 4px var(--shadow-color);
	}

	.icon-svg {
		width: 20px;
		height: 20px;
		color: var(--icon-color);
	}
</style>
