<!-- @component
	Props:
	- iconName: string
	- size: string
	- color: string

	A component that displays an icon from the icon store. Defaults to 24px and the --icon-color CSS variable.
-->
<script lang="ts">
	import { iconStore, type Icon } from '../../stores/iconStore';

	export let iconName: string;
	export let size: string = '24px';
	export let color: string = 'var(--icon-color)';

	let icon: Icon | undefined;

	$: {
		iconStore.subscribe((icons) => {
			icon = icons.find((i) => i.name === iconName);
		});
	}
</script>

<div class="icon-container">
	{#if icon}
		<svg
			class="icon"
			width={size}
			height={size}
			viewBox={icon.viewBox.join(' ')}
			aria-hidden="true"
			focusable="false"
			style="color: {color};"
		>
			<path fill="currentColor" d={icon.svgPath} />
		</svg>
	{/if}
</div>

<style>
	.icon-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon {
		display: inline-block;
	}
</style>
