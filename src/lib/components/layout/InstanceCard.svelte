<!-- @component
	Props:
	- instance: Instance
	- onEdit: (element: HTMLElement, instance: Instance) => void
	- onRemove: (instance: Instance) => void
	- onClick: (instance: Instance) => void

	A component that displays an instance card with an icon, title, and edit/remove buttons.
	The instance prop is used to display the instance data.
	The onEdit prop is a callback that is called when the edit button is clicked.
	The onRemove prop is a callback that is called when the remove button is clicked.
	The onClick prop is a callback that is called when the instance card is clicked.
-->

<script lang="ts">
	import { type Instance } from '../../stores/instanceStore';
	import Icon from '../atomic/Icon.svelte';

	export let instance: Instance;
	export let onEdit: (element: HTMLElement, instance: Instance) => void;
	export let onRemove: (instance: Instance) => void;
	export let onClick: (instance: Instance) => void;
</script>

<div class="instance-card card">
	<div
		on:click={() => onClick(instance)}
		on:keydown={(e) => e.key === 'Enter' && onClick(instance)}
		on:keyup={(e) => e.key === ' ' && onClick(instance)}
		class="instance-link"
		role="button"
		tabindex="0"
	>
		<Icon iconName={instance.icon} size="48px" color={instance.color} />
		<span class="instance-title">{instance.title}</span>
	</div>
	<div class="button-container">
		<button
			class="icon-button edit-button"
			on:click={(event) => onEdit(event.currentTarget, instance)}
			title="Edit"
		>
			<Icon iconName="pen" size="16px" />
		</button>
		<button class="icon-button remove-button" on:click={() => onRemove(instance)} title="Remove">
			<Icon iconName="trash" size="16px" />
		</button>
	</div>
</div>

<style>
	.instance-card {
		transition: all 0.3s ease;
		overflow: hidden;
		position: relative;
	}

	.instance-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 8px var(--shadow-color);
	}

	.instance-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
	}

	.instance-title {
		font-weight: bold;
		font-size: 1.25rem;
		margin-top: 1rem;
		text-align: center;
	}

	.button-container {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		background-color: rgba(var(--hover-bg-color-rgb), 0.8);
		position: absolute;
		top: 0;
		right: 0;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
		border-bottom-left-radius: 8px;
	}

	.instance-card:hover .button-container {
		opacity: 1;
	}

	.icon-button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		width: 24px;
		height: 24px;
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
</style>
