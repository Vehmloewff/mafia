<script context="module">
	export const route = {
		name: 'app.game.round.vote-result',
		route: 'vote-result',
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import Page from '../../../../components/page.svelte';
	import UserChip from '../../../../components/user-chip.svelte';
	import Progress from '../../../../components/progress.svelte';
	import { voteResult, trial } from './store';
	import { self, stateRouter, currentSocket, messageListener, users } from '../../../../store';

	export let id;
	export let round;

	$messageListener = (key, message) => {
		if (key === 'trial') {
			$trial = message;
			$stateRouter.go('app.game.round.vote', { id, round });
		} else if (key === 'round-over') {
			$stateRouter.go('app.game.round.recap', { id, round });
		} else if (key === 'game-over') {
			$stateRouter.go('app.game.game-end', { id });
		}
	};

	let judgesOnly = false;
	$: {
		const testArr = [...$voteResult.guilty, ...$voteResult.innocent];

		if (testArr.length === 1 && testArr[0] === 'JUDGE') judgesOnly = true;
	}

	$: verdict = $voteResult.isGuilty ? 'guilty' : 'innocent';

	$: {
		if (verdict === 'guilty') {
			if ($trial.user === $self.id) $self.isDead = true;

			const old = $users.get($trial.user);
			old.isDead = true;
			old.role = $voteResult.role;
			$users.set($trial.user, old);
		}
	}

	function done() {
		if ($self.isOwner) $currentSocket.send(`next`);
	}
</script>

<style>
	.container {
		--innocent: rgb(103, 175, 103);
		--guilty: rgb(214, 132, 132);
		--innocentBG: rgb(39, 68, 39);
		--guiltyBG: rgb(70, 17, 17);
	}

	.header {
		padding-top: 80px;
	}

	.verdict {
		font-weight: bold;
	}
	.verdict.guilty {
		color: var(--guilty);
	}
	.verdict.innocent {
		color: var(--innocent);
	}

	.one-liner {
		padding-top: 40vh;
	}

	.results {
		overflow: hidden;
	}

	.result {
		width: 100%;
		float: left;
	}
	.result .innocent {
		background: radial-gradient(var(--innocentBG), var(--background));
	}
	.result .guilty {
		background: radial-gradient(var(--guiltyBG), var(--background));
	}
	.result > div {
		padding: 8px;
	}

	@media (min-width: 700px) {
		.result {
			width: 50%;
		}
	}

	.user-padding {
		padding: 16px;
		display: inline-block;
	}

	.display {
		padding-top: 25px;
	}
</style>

<Page side={true}>
	<div class="container center">
		<h2 class="header">
			Verdict is
			<span class="verdict {verdict}">{verdict}</span>
		</h2>
		{#if judgesOnly}
			<p class="one-liner">That's what the Judge said.</p>
		{:else if $voteResult.innocent.length && $voteResult.guilty.length}
			<div class="results">
				<div class="result">
					<div class="innocent">
						<div class="title">{$voteResult.innocent.length} voted innocent</div>
						{#each $voteResult.innocent as user}
							<div class="user-padding">
								<UserChip defaultFull={true} id={user} />
							</div>
						{/each}
					</div>
				</div>
				<div class="result">
					<div class="guilty">
						<div class="title">{$voteResult.guilty.length} voted guilty</div>
						{#each $voteResult.guilty as user}
							<div class="user-padding">
								<UserChip defaultFull={true} id={user} />
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			<p class="one-liner">That's how everyone voted.</p>
		{/if}

		{#if $voteResult.isGuilty}
			<div class="display">
				<UserChip id={$trial.user} defaultFull={false} />
			</div>
		{/if}

		<div class="flashback">
			{#if $voteResult.isGuilty && $voteResult.role !== 'mafia' && $voteResult.guilty.indexOf($self.id) !== -1}
				<p>Uhh oh! You just convicted an innocent person!</p>
			{:else if !$voteResult.isGuilty && $voteResult.role === 'mafia' && $voteResult.guilty.indexOf($self.id) !== -1}
				<p>Oh yeah! You got the mafia!</p>
			{/if}
		</div>

		<Progress time={15 * 1000} on:done={done} />
	</div>
</Page>
