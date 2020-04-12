<script>
	import { self, showDisconnectedPage, currentSocket, stateRouter } from '../store';
	import createSocket from '../socket';
	import Button from './button.svelte';

	export let gameId;
	let retrying = false;
	let timeTillRetry = 5;
	let stoppedRetrying = false;

	let mightHaveMissed = false;

	let timeout;
	async function retry() {
		retrying = true;
		const $currentSocket = await createSocket(gameId);

		if ($createSocket) {
			retrying = false;
			$showDisconnectedPage = false;
			if (mightHaveMissed && !$self.isOwner) {
				$currentSocket.destroy();
				$stateRouter.go('app.game.resume', { id: gameId });
			}
		} else {
			if (timeTillRetry > 100 * 1000) return (stoppedRetrying = true);
			if (timeTillRetry > 5) mightHaveMissed = true;

			startCountdown();
			timeout = setTimeout(() => {
				retrying = false;
				retry();
				timeTillRetry = timeTillRetry * 2;
			}, timeTillRetry * 1000);
		}
	}

	let interval;
	let displayTime = timeTillRetry;
	function startCountdown() {
		interval = setInterval(() => {
			if (timeTillRetry <= 0) return clearInterval(interval);

			displayTime--;
		});
	}

	function forceRetry() {
		clearInterval(interval);
		clearTimeout(timeout);
		displayTime = 0;
		timeTillRetry = 0;
		retry();
	}
</script>

<style>
	.over {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

<div class="over">
	<div class="inner container center">
		<h3>We're having connection issues</h3>
		<p class="text-less">
			{#if stoppedRetrying}Failed to retry{:else if retrying}Retrying now...{:else}Retrying in {displayTime} seconds...{/if}
		</p>
		<p>
			<Button on:click={forceRetry}>Retry Now</Button>
		</p>
	</div>
</div>
