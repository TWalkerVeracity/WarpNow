<!-- @component
	Props:
	- onSubmit: (instance: Instance) => void
	- initialData: Instance | null

	A component that allows the user to add or update an instance. The initialData prop is used to prefill the form with existing data.
 -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import IconPicker from '../atomic/IconPicker.svelte';
	import Icon from '../atomic/Icon.svelte';
	import ColorPalette from '../atomic/ColorPalette.svelte';
	import type { Instance } from '../../stores/instanceStore';

	export let onSubmit: (instance: Instance) => void;
	export let initialData: Instance | null = null;

	const dispatch = createEventDispatcher();

	let title: string = initialData?.title || '';
	let href: string = initialData?.href || '';
	let selectedIcon: string = initialData?.icon || '';
	let selectedColor: string = initialData?.color || 'var(--icon-color-1)';
	let id: string = initialData?.id || new Date().getTime().toString();
	let isIconPickerOpen: boolean = false;
	let iconButton: HTMLElement;
	let hrefError: string = '';

	function handleSubmit() {
		if (title && href && selectedIcon && !hrefError) {
			const newInstance: Instance = {
				id,
				icon: selectedIcon,
				title,
				href,
				color: selectedColor,
			};
			onSubmit(newInstance);
			dispatch('submit', newInstance);
		}
	}

	function openIconPicker() {
		isIconPickerOpen = true;
	}

	function handleSelectIcon(icon: string) {
		selectedIcon = icon;
	}

	function handleColorSelect(color: string) {
		selectedColor = color;
	}

	function validateAndFormatURL(input: string): string {
		let url;
		try {
			// If input doesn't start with a protocol, prepend 'https://'
			if (!input.startsWith('http://') && !input.startsWith('https://')) {
				input = 'https://' + input;
			}
			url = new URL(input);
		} catch (e) {
			hrefError = 'Invalid URL';
			return input;
		}

		// Check if the protocol is http or https
		if (url.protocol !== 'http:' && url.protocol !== 'https:') {
			hrefError = 'Only http and https protocols are allowed';
			return input;
		}

		// Strip the protocol, path, query parameters, and hash
		const formattedURL = url.hostname;
		hrefError = ''; // Clear any previous errors
		return formattedURL;
	}

	function handleHrefChange() {
		href = validateAndFormatURL(href);
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="instance-form">
	<div class="form-group">
		<label for="icon">Icon:</label>
		<button type="button" on:click={openIconPicker} bind:this={iconButton} class="icon-button">
			{#if selectedIcon}
				<Icon iconName={selectedIcon} size="24px" color={selectedColor} />
			{:else}
				<div class="icon-placeholder">Select an icon</div>
			{/if}
		</button>
		<IconPicker bind:isOpen={isIconPickerOpen} onSelectIcon={handleSelectIcon} anchorElement={iconButton} />
	</div>
	<div class="form-group">
		<label for="icon-color">Icon Color:</label>
		<ColorPalette {selectedColor} onColorSelect={handleColorSelect} />
	</div>
	<div class="form-group">
		<label for="title">Title:</label>
		<input type="text" id="title" bind:value={title} required placeholder="Enter title" />
	</div>
	<div class="form-group">
		<label for="link">Instance Link:</label>
		<div class="input-group">
			<input id="link" bind:value={href} on:blur={handleHrefChange} required placeholder="Enter URL" />
		</div>
		{#if hrefError}
			<span class="error-message">{hrefError}</span>
		{/if}
	</div>
	<button type="submit" class="submit-button" disabled={!title || !href || !selectedIcon || !!hrefError}>
		{initialData ? 'Update' : 'Add'} Instance
	</button>
</form>

<style>
	.instance-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		background-color: var(--card-bg-color);
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--shadow-color);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: bold;
		color: var(--text-color);
	}

	input,
	.icon-button {
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-size: 1rem;
		color: var(--text-color);
	}

	.icon-button {
		background-color: var(--card-bg-color);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 2.5rem;
		transition: background-color 0.2s ease;
	}

	input::placeholder,
	.icon-placeholder {
		color: var(--text-color);
		opacity: 0.6;
	}

	.input-group {
		display: flex;
		gap: 0.5rem;
	}

	.input-group > input {
		flex-grow: 1;
	}

	.icon-button:hover {
		background-color: var(--hover-bg-color);
	}

	.submit-button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.submit-button {
		background-color: #4299e1;
		color: white;
	}

	.submit-button:hover {
		background-color: #3182ce;
	}

	.error-message {
		color: #e53e3e;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.submit-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
