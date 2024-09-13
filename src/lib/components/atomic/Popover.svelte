<!-- @component
	Props:
	- show: boolean
	- message: string
	- duration: number
	- target: HTMLElement | null

	A component that displays a popover element with a message when show is true. The message prop is used to set the text of the popover.
	The duration prop is used to set the duration of the popover's display and hide animations.
	The target prop is used to position the popover relative to the target element.
 -->
<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let show = false;
	export let message = 'Copied!';
	export let duration = 2000; // Duration in milliseconds
	export let target: HTMLElement | null = null;

	let popoverElement: HTMLElement;
	let timeoutId: number;

	onMount(() => {
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});

	$: if (show) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			show = false;
		}, duration);
	}

	$: if (show && target && popoverElement) {
		const targetRect = target.getBoundingClientRect();
		const popoverRect = popoverElement.getBoundingClientRect();

		const top = targetRect.top - popoverRect.height - 10;
		const left = targetRect.left + (targetRect.width - popoverRect.width) / 2;

		popoverElement.style.top = `${top}px`;
		popoverElement.style.left = `${left}px`;
	}
</script>

{#if show}
	<div bind:this={popoverElement} class="popover" transition:fly={{ y: -10, duration: 200 }}>
		{message}
	</div>
{/if}

<style>
	.popover {
		position: fixed;
		background-color: var(--card-bg-color);
		color: var(--text-color);
		padding: 5px 10px;
		border-radius: 4px;
		font-size: 0.8rem;
		box-shadow: 0 2px 4px var(--shadow-color);
		z-index: 1000;
	}
</style>
