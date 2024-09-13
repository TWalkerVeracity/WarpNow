<script lang="ts">
	import InstancesPane from './lib/components/layout/InstancesPane.svelte';
	import { addInstance, updateInstance, type Instance } from './lib/stores/instanceStore';
	import InstanceForm from './lib/components/layout/InstanceForm.svelte';
	import Icon from './lib/components/atomic/Icon.svelte';
	import PageHeader from './lib/components/layout/PageHeader.svelte';
	import HelpModal from './lib/components/layout/HelpModal.svelte';
	import Popup from './lib/components/atomic/Popup.svelte';
	import PathPreview from './lib/components/layout/PathPreview.svelte';
	import { themeStore } from './lib/stores/themeStore';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let isFormPopupOpen = false;
	let isHelpModalOpen = false;
	let editingInstance: Instance | null = null;
	let formAnchorElement: HTMLElement | null = null;
	let currentPath: Location;

	function handleInstanceSubmit(instance: Instance) {
		if (editingInstance && editingInstance.id) {
			updateInstance(editingInstance.id, instance);
		} else {
			addInstance(instance);
		}
		closePopup();
	}

	function openPopup(element: HTMLElement, instance: Instance | null = null) {
		isFormPopupOpen = true;
		editingInstance = instance ? { ...instance } : null;
		formAnchorElement = element;
	}

	function closePopup() {
		isFormPopupOpen = false;
		editingInstance = null;
	}

	onMount(() => {
		themeStore.setTheme($themeStore);
		currentPath = window.location;
	});
</script>

<!-- App Container -->
<main class="app-container">
	<PageHeader onShowHelp={() => (isHelpModalOpen = !isHelpModalOpen)} />
	<PathPreview currentPath={currentPath + ''} />
	<div class="instances-container">
		<div class="instances-header">
			<h2 class="section-title">Instances</h2>
			<div class="button-group">
				<button
					on:click={(event) => openPopup(event.currentTarget)}
					class="button button-primary"
					bind:this={formAnchorElement}
					title="Add new instance"
				>
					<Icon iconName="plus" size="20px" color="currentColor" />
					<span>Add Instance</span>
				</button>
			</div>
		</div>

		<!-- Instances Pane -->
		<InstancesPane onEdit={openPopup} onAdd={openPopup} />
	</div>
</main>

<!-- Help Modal -->
{#if isHelpModalOpen}
	<HelpModal bind:isOpen={isHelpModalOpen} />
{/if}

<!-- Form Popup -->
<Popup bind:isOpen={isFormPopupOpen} anchorElement={formAnchorElement} maxWidth="800px">
	<div in:fly={{ y: 20, duration: 300 }}>
		<InstanceForm onSubmit={handleInstanceSubmit} initialData={editingInstance} />
	</div>
</Popup>

<style>
	.app-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.instances-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin: 5rem 2rem;
	}

	.instances-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--text-color);
		margin: 0;
	}

	.button-group {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	@media (max-width: 768px) {
		.app-container {
			padding: 1rem;
		}

		.instances-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}
</style>
