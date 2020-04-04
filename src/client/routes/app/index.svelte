<script context="module">
	export const route = {
		name: `app`,
		route: `/`,
		defaultChild: `home`,
	};
</script>

<script>
	import { stateRouter, self } from '../../store';
	import Modal from '../../components/modal.svelte';
	const gameInProgress = localStorage.getItem(`game-in-progress`);
	import Snackbar from '../../components/snackbar.svelte';

	if (gameInProgress) $stateRouter.go(`app.game`, { id: gameInProgress }, { replace: true });
</script>

<style>
	.app {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: var(--background);
		color: var(--foreground);
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.app::-webkit-scrollbar {
		width: 0;
	}
</style>

<svelte:head>
	{#if $self.name}
		<title>Mafia • {$self.name}</title>
	{/if}
</svelte:head>

<div class="app">
	<Modal>
		<div class="centered">
			<uiView />
		</div>
	</Modal>
</div>

<Snackbar />
