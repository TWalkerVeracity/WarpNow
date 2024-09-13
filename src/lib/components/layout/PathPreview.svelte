<!-- @component
	Props:
	- currentPath: string

	A component that displays the current url path and a button to copy it to the clipboard.
	The currentPath prop is used to display the current path.
 -->
<script lang="ts">
	import Popover from '../atomic/Popover.svelte';
	import Icon from '../atomic/Icon.svelte';

	export let currentPath: string;

	let showCopyPopover = false;

	$: displayPath = currentPath || '/';

	function copyPath() {
		navigator.clipboard
			.writeText(currentPath)
			.then(() => {
				showCopyPopover = true;
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
	}
</script>

<div class="path-preview">
	<div class="path">
		<span class="value">{displayPath}</span>
	</div>
	<div class="copy-button-container">
		<button class="copy-button" on:click={copyPath} title="Copy current location">
			<Icon iconName="copy" size="20px" color="currentColor" />
		</button>
		<Popover bind:show={showCopyPopover} />
	</div>
</div>

<style>
	.path-preview {
		margin: 2rem;
		display: flex;
		align-items: center;
		background-color: var(--card-bg-color);
		padding: 1rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px var(--shadow-color);
		transition: box-shadow 0.3s ease;
	}

	.path-preview:hover {
		box-shadow: 0 6px 8px var(--shadow-color);
	}

	.path {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.value {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-color);
		word-break: break-all;
		padding: 0.5rem;
		background-color: var(--bg-color);
		border-radius: 6px;
		box-shadow: inset 0 1px 3px var(--shadow-color);
	}
	.copy-button-container {
		position: relative;
	}

	.copy-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		margin-left: 1rem;
		color: var(--icon-color);
		transition: color 0.3s ease;
	}

	.copy-button:hover {
		color: var(--text-color);
	}
</style>
