<!-- @component
	Props:
	- onEdit: (element: HTMLElement, instance: Instance) => void
	- onAdd: (element: HTMLElement) => void

	A component that displays a grid of instances. Each instance is represented by a card that contains an icon, title, and edit/remove buttons.
	The onEdit and onAdd props are callbacks that are called when the edit or add buttons are clicked.
 -->
<script lang="ts">
	import { instanceStore, removeInstance, type Instance } from '../../stores/instanceStore';
	import InstanceCard from './InstanceCard.svelte';
	import WelcomeCard from './WelcomeCard.svelte';

	export let onEdit: (element: HTMLElement, instance: Instance) => void;
	export let onAdd: (element: HTMLElement) => void;

	let instances: Instance[] = [];
	instanceStore.subscribe((value) => {
		instances = value;
	});

	function onClick(instance: Instance) {
		const url = new URL(window.location.href);
		url.host = instance.href;
		window.open(url.toString(), '_blank');
	}
</script>

{#if instances.length === 0}
	<div class="card">
		<WelcomeCard {onAdd} />
	</div>
{:else}
	<div class="instances-pane">
		{#each instances as instance, index}
			<InstanceCard
				{instance}
				{onEdit}
				onRemove={() => removeInstance(instance.id)}
				onClick={() => onClick(instance)}
			/>
		{/each}
	</div>
{/if}

<style>
	.instances-pane {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
	}
</style>
