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
	import { stateRouter, currentSocket, messageListener, users, self } from '../../../store';
	import { onMount, onDestroy } from 'svelte';
	import { gameStatus } from '../../../verify-game';
	import Loader from '../../../components/loader.svelte';
	import Button from '../../../components/button.svelte';
	import Page from '../../../components/page.svelte';
	import { exitGame, setOwner } from '../../../services';
	import createSocket from '../../../socket';

	let message = `Detecting game`;
	let nonExistent = false;
	let found = false;
	export let id;

	const timeouts = [];

	onMount(async () => {
		const status = await gameStatus(id);

		if (status === 'started') {
			message = `Connecting to game`;

			await connect();

			found = true;

			let round;
			let gameOver = false;
			let onTrack = false;
			const wait = 1000 * 10;
			$messageListener = (key, params) => {
				if ($self.isOwner && (key === 'narrative' || key === 'vote-result')) {
					timeouts.push(
						setTimeout(() => {
							$currentSocket.send('next');
						}, wait)
					);
					onTrack = true;
				} else if ($self.isOwner && key === 'trial') {
					timeouts.push(
						setTimeout(() => {
							$currentSocket.send('start-vote');
						}, wait)
					);
					onTrack = true;
				} else if ($self.isOwner && key === 'round-over') {
					timeouts.push(
						setTimeout(() => {
							$currentSocket.send('start-next-round');
						}, wait)
					);
					onTrack = true;
				} else if (key === 'round') {
					round = params;
					$currentSocket.send(`get-all-users`);
				} else if (key === 'game-over') {
					gameOver = true;
					$currentSocket.send(`get-all-users`);
				} else if (key === 'all-users') {
					setUsers(params);
					if (round) $stateRouter.go('app.game.round', { id, round }, { replace: true });
					else if (gameOver) $stateRouter.go('app.game.game-end', { id }, { replace: true });
				}
			};

			$currentSocket.send(`get-all-users`);

			if ($self.isOwner)
				timeouts.push(
					setTimeout(() => {
						if (!onTrack) $currentSocket.send('next');
					}, wait)
				);
		} else if (status === 'ok') {
			await connect();
			$stateRouter.go('app.game.pre-start', { id }, { replace: true });
		} else {
			nonExistent = true;
		}
	});

	function setUsers(params) {
		$users = new Map();

		params.forEach(user => {
			$users.set(user.id, user);
		});

		setOwner();
	}

	async function connect() {
		$currentSocket = await createSocket(id);
	}

	onDestroy(() => timeouts.forEach(timeout => clearTimeout(timeout)));
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
		{:else if found}
			<h3>Connected!</h3>
			<h4>We'll pop you into the game at the next round.</h4>
			<div style="padding-top: 10px">
				<Button state="app.home" on:click={() => localStorage.removeItem(`game-in-progress`)}>Exit game</Button>
			</div>
		{:else}
			<div style="padding-bottom: 18px">
				<Loader />
			</div>
			{message}...
			<div style="padding-top: 10px">
				<Button on:click={exitGame}>Cancel</Button>
			</div>
		{/if}
	</div>
</Page>
