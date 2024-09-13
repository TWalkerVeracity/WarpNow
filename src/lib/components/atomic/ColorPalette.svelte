<!-- @component
	Props:
	- selectedColor: string
	- onColorSelect: (color: string) => void

	A color palette component that allows the user to select a color from a set of predefined colors.
-->
<script lang="ts">
	export let selectedColor: string;
	export let onColorSelect: (color: string) => void;

	const colorPalette = [
		'var(--icon-color-1)',
		'var(--icon-color-2)',
		'var(--icon-color-3)',
		'var(--icon-color-4)',
		'var(--icon-color-5)',
		'var(--icon-color-6)',
		'var(--icon-color-7)',
		'var(--icon-color-8)',
	];
</script>

<div class="color-palette">
	{#each colorPalette as color}
		<button
			type="button"
			class="color-option"
			style="background-color: {color};"
			class:selected={selectedColor === color}
			on:click={() => onColorSelect(color)}
		></button>
	{/each}
</div>

<style>
	.color-palette {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.color-option {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid var(--border-color);
		cursor: pointer;
		transition: transform 0.2s ease;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.color-option:hover {
		transform: scale(1.1);
	}

	.color-option.selected {
		border-color: var(--text-color);
		transform: scale(1.1);
	}
</style>
