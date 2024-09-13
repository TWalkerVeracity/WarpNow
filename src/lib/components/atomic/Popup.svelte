<!-- @component		
 -->
<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';

	/**
	 * Props:
	 * - isOpen: boolean
	 * - anchorElement: HTMLElement | null
	 * - maxWidth: string
	 *
	 * A component that displays a popup element when isOpen is true. The anchorElement prop is used to position the popup relative to the anchor element.
	 * The maxWidth prop is used to set the maximum width of the popup.
	 */
	export let isOpen: boolean;
	export let anchorElement: HTMLElement;
	export let maxWidth: string = '300px';

	let popupContent: HTMLElement;
	let position = { top: 0, left: 0 };
	let placement = 'bottom';
	let caretOffset = 0;

	type Placement = 'top' | 'bottom' | 'left' | 'right';
	const placements: Placement[] = ['top', 'bottom', 'left', 'right'];

	/**
	 * Updates the position of the popup when the isOpen prop changes.
	 */
	$: if (isOpen && anchorElement) {
		tick().then(updatePosition);
	}

	/**
	 * Updates the position of the popup based on the anchor element.
	 */
	async function updatePosition(): Promise<void> {
		if (!popupContent || !anchorElement) return;

		const anchorRect = anchorElement.getBoundingClientRect();
		const popupRect = popupContent.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		const bestPlacement = findBestPlacement(anchorRect, popupRect, viewportWidth, viewportHeight);
		const { top, left } = calculatePosition(bestPlacement, anchorRect, popupRect);

		position = { top, left };
		placement = bestPlacement;
		caretOffset = calculateCaretOffset(bestPlacement, anchorRect, popupRect);
	}

	/**
	 * Finds the best placement for the popup based on the anchor element.
	 * @param anchorRect - The bounding client rect of the anchor element.
	 * @param popupRect - The bounding client rect of the popup element.
	 * @param viewportWidth - The width of the viewport.
	 * @param viewportHeight - The height of the viewport.
	 * @returns The best placement for the popup.
	 */
	function findBestPlacement(
		anchorRect: DOMRect,
		popupRect: DOMRect,
		viewportWidth: number,
		viewportHeight: number
	): Placement {
		const scores = placements.map((p) => ({
			placement: p,
			score: getPlacementScore(p, anchorRect, popupRect, viewportWidth, viewportHeight),
		}));

		return scores.reduce((best, current) => (current.score > best.score ? current : best)).placement;
	}

	/**
	 * Calculates the score for a placement based on the anchor element.
	 * @param placement - The placement to calculate the score for.
	 * @param anchorRect - The bounding client rect of the anchor element.
	 * @param popupRect - The bounding client rect of the popup element.
	 * @param viewportWidth - The width of the viewport.
	 * @param viewportHeight - The height of the viewport.
	 * @returns The score for the placement.
	 */
	function getPlacementScore(
		placement: Placement,
		anchorRect: DOMRect,
		popupRect: DOMRect,
		viewportWidth: number,
		viewportHeight: number
	) {
		const { top, left } = calculatePosition(placement, anchorRect, popupRect);
		let score = 0;

		// Check if the popup is within the viewport
		if (
			top >= 0 &&
			left >= 0 &&
			top + popupRect.height <= viewportHeight &&
			left + popupRect.width <= viewportWidth
		) {
			score += 100;
		}

		// Prefer placements with more space
		if (placement === 'top') score += anchorRect.top;
		if (placement === 'bottom') score += viewportHeight - anchorRect.bottom;
		if (placement === 'left') score += anchorRect.left;
		if (placement === 'right') score += viewportWidth - anchorRect.right;

		return score;
	}

	/**
	 * Calculates the position of the popup based on the placement and anchor element.
	 * @param placement - The placement of the popup.
	 * @param anchorRect - The bounding client rect of the anchor element.
	 * @param popupRect - The bounding client rect of the popup element.
	 * @returns The position of the popup.
	 */
	function calculatePosition(placement: Placement, anchorRect: DOMRect, popupRect: DOMRect) {
		let top, left;

		switch (placement) {
			case 'top':
				top = anchorRect.top - popupRect.height - 10;
				left = anchorRect.left;
				break;
			case 'bottom':
				top = anchorRect.bottom + 10;
				left = anchorRect.left;
				break;
			case 'left':
				top = anchorRect.top;
				left = anchorRect.left - popupRect.width - 10;
				break;
			case 'right':
				top = anchorRect.top;
				left = anchorRect.right + 10;
				break;
		}

		// Ensure the popup stays within the viewport
		top = Math.max(0, Math.min(top, window.innerHeight - popupRect.height));
		left = Math.max(0, Math.min(left, window.innerWidth - popupRect.width));

		return { top, left };
	}

	/**
	 * Calculates the caret offset based on the placement and anchor element.
	 * @param placement - The placement of the popup.
	 * @param anchorRect - The bounding client rect of the anchor element.
	 * @param popupRect - The bounding client rect of the popup element.
	 * @returns The caret offset.
	 */
	function calculateCaretOffset(placement: Placement, anchorRect: DOMRect, popupRect: DOMRect) {
		switch (placement) {
			case 'top':
			case 'bottom':
				return anchorRect.left + anchorRect.width / 2 - position.left;
			case 'left':
			case 'right':
				return anchorRect.top + anchorRect.height / 2 - position.top;
		}
	}

	/**
	 * Handles clicks outside the popup.
	 * @param event - The click event.
	 */
	function handleClickOutside(event: MouseEvent): void {
		if (
			isOpen &&
			popupContent &&
			!popupContent.contains(event.target as Node) &&
			anchorElement &&
			!anchorElement.contains(event.target as Node)
		) {
			isOpen = false;
		}
	}

	/**
	 * Adds event listeners to update the position of the popup when the window is resized or the document is clicked outside the popup.
	 */
	onMount(() => {
		window.addEventListener('resize', updatePosition);
		document.addEventListener('mousedown', handleClickOutside);
	});

	/**
	 * Removes event listeners to update the position of the popup when the window is resized or the document is clicked outside the popup.
	 */
	onDestroy(() => {
		window.removeEventListener('resize', updatePosition);
		document.removeEventListener('mousedown', handleClickOutside);
	});
</script>

{#if isOpen && anchorElement}
	<div
		bind:this={popupContent}
		class="popup-container"
		style="top: {position.top}px; left: {position.left}px; max-width: {maxWidth};"
	>
		<div
			class="caret caret-{placement}"
			style="{placement === 'top' || placement === 'bottom' ? 'left' : 'top'}: {caretOffset}px;"
		></div>
		<div class="popup">
			<div class="popup-content">
				<slot></slot>
			</div>
		</div>
	</div>
{/if}

<style>
	.popup-container {
		position: fixed;
		display: flex;
		flex-direction: column;
		z-index: 1000;
	}

	.popup {
		background-color: var(--bg-color);
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--shadow-color);
		color: var(--text-color);
		width: 100%;
		overflow: visible;
	}

	.popup-content {
		border-radius: 8px;
	}

	.caret {
		position: absolute;
		width: 0;
		height: 0;
		border: 10px solid transparent;
		z-index: 1;
	}

	.caret-bottom {
		top: -20px;
		border-bottom-color: var(--card-bg-color);
	}

	.caret-top {
		bottom: -20px;
		border-top-color: var(--card-bg-color);
	}

	.caret-right {
		left: -20px;
		border-right-color: var(--card-bg-color);
	}

	.caret-left {
		right: -20px;
		border-left-color: var(--card-bg-color);
	}
</style>
