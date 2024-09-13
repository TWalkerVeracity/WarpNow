<!-- @component
	Props:
	- isOpen: boolean

	A component that displays a modal with a welcome card.
 -->
<script lang="ts">
	import Modal from '../atomic/Modal.svelte';
	import WelcomeCard from './WelcomeCard.svelte';
	export let isOpen: boolean;
</script>

<Modal bind:isOpen>
	<WelcomeCard showButton={false} onAdd={() => {}} />
</Modal>
