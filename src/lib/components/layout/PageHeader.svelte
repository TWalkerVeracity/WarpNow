<!-- @component
	Props:
	- onShowHelp: () => void

	A component that displays a header with a title, description, and actions.
	Has a toggleTheme function that toggles the theme between light and dark and a link to the GitHub repository.
 -->
<script lang="ts">
	import { themeStore } from '../../stores/themeStore';
	import Icon from '../atomic/Icon.svelte';

	export let onShowHelp: () => void = () => {};

	function toggleTheme() {
		themeStore.toggleTheme();
	}
</script>

<header class="page-header">
	<div class="header-content">
		<h1>WarpNow</h1>
		<p class="description">A lightweight tool for sharing links across instances.</p>
	</div>
	<div class="header-actions">
		<button on:click={onShowHelp} class="icon-button" title="Help">
			<Icon iconName="question" size="24px" />
		</button>
		<button on:click={toggleTheme} class="icon-button" title="Toggle theme">
			<Icon iconName={$themeStore === 'dark' ? 'sun' : 'moon'} size="24px" />
		</button>
		<button
			class="icon-button"
			on:click={() => window.open('https://github.com/TWalkerVeracity', '_blank')}
			title="GitHub"
		>
			<Icon iconName="github" size="24px" />
		</button>
	</div>
</header>

<style>
	.page-header {
		position: relative;
		padding: 1rem;
		border-radius: 12px;
		transition: box-shadow 0.3s ease;
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.description {
		color: var(--text-color);
		opacity: 0.6;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	.icon-button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		width: 32px;
		height: 32px;
		padding: 0;
		border-radius: 50%;
		transition: background-color 0.2s ease-in-out;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-button:hover {
		background-color: var(--hover-bg-color);
	}

	h1 {
		margin: 0;
	}

	p {
		margin: 0;
	}
</style>
