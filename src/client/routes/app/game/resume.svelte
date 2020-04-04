<script context="module">
	export const route = {
		name: `app.game.resume`,
		route: `resume`,
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import { stateRouter, currentSocket } from '../../../store';
	import { onMount } from 'svelte';
	import { gameStatus } from '../../../verify-game';
	import Loader from '../../../components/loader.svelte';
	import Button from '../../../components/button.svelte';
	import Page from '../../../components/page.svelte';
	import { sureExitGame } from '../../../services';
	import createSocket from '../../../socket';

	let message = `Detecting game`;
	let nonExistent = false;
	export let id;

	onMount(async () => {
		const status = await gameStatus(id);

		if (status === 'started') {
			message = `Connecting to game`;

			connect();
		} else if (status === 'ok') {
			await connect();
			$stateRouter.go('app.game.pre-start', { id }, { replace: true });
		} else {
			nonExistent = true;
		}
	});

	async function connect() {
		$currentSocket = await createSocket(id);
	}
</script>

<style>
	.center {
		padding-top: calc(50vh - 79px);
	}
</style>

<Page delay={100}>
	<div class="center container">
		{#if nonExistent}
			<h3>You started a game, and didn't finish it</h3>
			<h4>But it has already ended or timed out</h4>
			<div style="padding-top: 10px">
				<Button state="app.home" on:click={() => localStorage.removeItem(`game-in-progress`)}>Exit game</Button>
			</div>
		{:else}
			<div style="padding-bottom: 18px">
				<Loader />
			</div>
			{message}...
			<div style="padding-top: 10px">
				<Button on:click={sureExitGame}>Cancel</Button>
			</div>
		{/if}
	</div>
</Page>
