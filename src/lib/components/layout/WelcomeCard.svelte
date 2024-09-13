<!-- @component
	Props:
	- onAdd: (element: HTMLElement) => void

	A component that displays a welcome card with instructions on how to use WarpNow.
	The onAdd prop is used to call the onAdd callback when the add instance button is clicked.
 -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '../atomic/Icon.svelte';

	export let onAdd: (element: HTMLElement) => void;
	export let showButton: boolean = true;

	const baseUrl = 'https://example.';
	const domain = '-now.com/sys_script.do&sys_id=ae4436b7c6112271007c15c067d5969d';
	const words = ['service', 'warp'];
	let currentWordIndex = 0;
	let displayedWord = words[currentWordIndex];
	let cursorPosition = displayedWord.length;
	let isDeleting = false;

	function animateUrl() {
		if (isDeleting) {
			if (cursorPosition > 0) {
				cursorPosition--;
				displayedWord = displayedWord.slice(0, cursorPosition);
				setTimeout(animateUrl, 100);
			} else {
				isDeleting = false;
				currentWordIndex = (currentWordIndex + 1) % words.length;
				setTimeout(animateUrl, 500);
			}
		} else {
			const targetWord = words[currentWordIndex];
			if (cursorPosition < targetWord.length) {
				cursorPosition++;
				displayedWord = targetWord.slice(0, cursorPosition);
				setTimeout(animateUrl, 100);
			} else {
				isDeleting = true;
				setTimeout(animateUrl, 1000);
			}
		}
	}

	onMount(() => {
		setTimeout(animateUrl, 1000);
	});
</script>

<div class="welcome-card">
	<h2>Welcome to WarpNow!</h2>
	<div class="help-content">
		<p>WarpNow simplifies sharing ServiceNow instance links:</p>
		<ul>
			<li>No need to know an instance name to share a link</li>
			<li>Just replace "service" with "warp" in the URL</li>
			<li>That's it! You're ready to share, no more dead links.</li>
			<li>
				We don't store any data. Instances are kept in your browser's local storage, accessible only to you.
			</li>
		</ul>
		<p>For example:</p>
		<div class="url-animation">
			<span class="url-text">
				{baseUrl}<span class="changing-part">{displayedWord}</span>{domain}
			</span>
		</div>
	</div>

	{#if showButton}
		<div class="button-container">
			<button class="add-instance-button" on:click={(event) => onAdd(event.currentTarget)}>
				<Icon iconName="plus" size="24px" color="currentColor" />
				Add Your First Instance
			</button>
		</div>
	{/if}
</div>

<style>
	.welcome-card {
		text-align: center;
		padding: 2rem;
		background-color: var(--card-bg-color);
		border-radius: 8px;
	}

	.welcome-card h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: var(--text-color);
	}

	.welcome-card p {
		margin-bottom: 1rem;
		color: var(--text-color);
		line-height: 1.6;
	}

	.help-content {
		text-align: left;
		margin-bottom: 1.5rem;
	}

	.help-content p {
		margin-bottom: 0.5rem;
	}

	.help-content ul {
		list-style-type: none;
		padding-left: 1rem;
		margin-bottom: 1rem;
	}

	.help-content li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.help-content li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--primary-color);
	}

	.url-animation {
		position: relative;
		background-color: var(--bg-color);
		padding: 0.5rem;
		border-radius: 4px;
		margin: 1.5rem 0;
		font-family: monospace;
		height: 1.5em;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.url-text {
		display: inline-block;
		position: relative;
		z-index: 1;
	}

	.changing-part {
		position: relative;
		color: var(--primary-color);
		font-weight: bold;
	}

	.button-container {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	.add-instance-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		font-size: 1.1rem;
		font-weight: bold;
		color: var(--primary-button-text-color);
		background-color: var(--primary-button-color);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.add-instance-button:hover {
		background-color: var(--primary-button-color-hover);
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}
</style>
