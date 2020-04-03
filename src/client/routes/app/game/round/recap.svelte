<script context="module">
	export const route = {
		name: `app.game.round.recap`,
		route: `recap`,
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import Page from '../../../../components/page.svelte';
	import { trials, eliminated as eliminatedStore, trial } from './store';
	import UserChip from '../../../../components/user-chip.svelte';
	import Button from '../../../../components/button.svelte';
	import { self, currentSocket, stateRouter, messageListener } from '../../../../store';

	export let id;

	$: eliminated = [
		...$eliminatedStore.map(({ id }) => ({ id: id, reason: 'mafia' })),
		...$trials.filter(trial => trial.isGuilty).map(trial => ({ id: trial.user, reason: 'arrested' })),
	];

	$messageListener = (key, message) => {
		if (key === 'round') {
			$trials = [];
			$trial = {};
			$stateRouter.go(`app.game.round`, { id, round: message });
		}
	};

	function nextRound() {
		$currentSocket.send('start-next-round');
	}
</script>

<style>
	.padding {
		padding: 60px 0 100px 0;
	}
</style>

<Page side={true}>
	<div class="center container">
		<h2 style="padding-top: 80px;">Wow!</h2>
		<div class="padding">
			{#each eliminated as user}
				<div class="personal-space">
					<UserChip id={user.id} defaultOpen={true} />
				</div>
			{:else}
				<p>Everyone managed to stay alive!</p>
			{/each}
		</div>
		<p>Ready for the next round?</p>
		{#if $self.isOwner}
			<Button on:click={nextRound}>Next Round</Button>
		{/if}
	</div>
</Page>
