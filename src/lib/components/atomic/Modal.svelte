<script lang="ts">
	import Icon from '../atomic/Icon.svelte';
	import { onMount, onDestroy } from 'svelte';

	export let isOpen: boolean = false;
	export let modalOverlay: HTMLElement | null = null;
	export let modalContent: HTMLElement | null = null;

	function closeModal() {
		isOpen = false;
	}

	/**
	 * Handles keydown events to close the modal when the escape key is pressed.
	 * @param event
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	/**
	 * Handles click events outside the modal to close the modal.
	 * @param event
	 */
	function handleClickOutside(event: MouseEvent) {
		if (modalOverlay && modalContent && event.target instanceof Node) {
			if (modalOverlay.contains(event.target) && !modalContent.contains(event.target)) {
				closeModal();
			}
		}
	}

	/**
	 * Adds event listeners to close the modal when the escape key is pressed or the modal is clicked outside.
	 */
	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('mousedown', handleClickOutside);
	});

	/**
	 * Removes event listeners to close the modal when the escape key is pressed or the modal is clicked outside.
	 */
	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);
		document.removeEventListener('mousedown', handleClickOutside);
	});
</script>

<div class="modal-overlay" role="dialog" aria-modal="true" bind:this={modalOverlay}>
	<div class="modal-content" role="document" bind:this={modalContent}>
		<button class="close-button" on:click={closeModal} aria-label="Close" title="Close">
			<Icon iconName="x" size="12px" color="var(--text-color)" />
		</button>
		<slot></slot>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background-color: var(--card-bg-color);
		padding: 2rem;
		border-radius: 8px;
		max-width: 90%;
		max-height: 90%;
		overflow-y: auto;
		position: relative;
		box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-color);
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.close-button:hover {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 50%;
	}
</style>
