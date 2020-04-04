<script context="module">
	export const route = {
		name: 'app.game.round.vote',
		route: 'vote',
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import Page from '../../../../components/page.svelte';
	import Progress from '../../../../components/progress.svelte';
	import Button from '../../../../components/button.svelte';
	import { trial, trials, voteResult, snorts as snortsStore } from './store';
	import { users, self, currentSocket, messageListener, stateRouter } from '../../../../store';
	import snorts from '../../../../../default-snorts';
	import { fly } from 'svelte/transition';

	$: accused = $users.get($trial.user).name;
	$: accusedBy = ($users.get($trial.accusedBy) || getUserString($trial.accusedBy)).name;

	export let id;
	export let round;

	$messageListener = (key, message) => {
		if (key === 'started-vote') voting = true;
		if (key === 'vote-result') {
			$snortsStore = message.snorts;
			$voteResult = message;
			$stateRouter.go('app.game.round.snore', { next: `vote-result`, id, round });
		}
	};

	let voting = false;
	let guilty = null;
	let selectedSnort = null;

	$: guilty !== null ? sendSelection(guilty ? 'guilty' : 'innocent') : null;
	$: selectedSnort !== null ? sendSelection(selectedSnort) : null;

	function sendSelection(selection) {
		$currentSocket.send(`vote`, selection);
	}

	function getUserString(str) {
		if (str === 'SHERIFF') return { name: 'The Sheriff' };
	}

	function startVote() {
		$currentSocket.send(`start-vote`);
	}
</script>

<style>
	.header {
		padding-top: calc(55px + 30vh);
		font-size: 30px;
		transition: font-size 400ms, padding-top 400ms;
	}
	.header.voting {
		padding-top: 80px;
		font-size: 25px;
	}

	.selection,
	.other {
		padding-top: 50px;
	}

	.item {
		display: inline-block;
		padding: 5px 8px;
		margin: 16px;
		border-radius: 4px;
		background: var(--action);
		color: var(--foreground-more);
		cursor: pointer;
		user-select: none;
	}
	.item.active {
		opacity: 0.7;
		text-decoration: line-through;
	}

	.floored {
		padding-top: 30vh;
		padding-bottom: 100px;
	}
</style>

<Page side={true}>
	<div class="container center">
		<h3 class="header" class:voting>{accusedBy} is accusing {accused} of being the mafia!</h3>
		{#if !voting}
			<p>{accused}, what do you have to say for yourself?</p>
		{:else}
			<p>Do you think that {accused} is innocent or guilty?</p>
		{/if}

		{#if voting && $trial.canVote}
			<div class="selection" in:fly={{ y: 20 }}>
				<div class="item" class:active={guilty === false} on:click={() => (guilty = false)}>Innocent</div>
				<div class="item" class:active={guilty === true} on:click={() => (guilty = true)}>Guilty</div>
			</div>
		{:else if voting && $trial.isCitizensArrest}
			<div class="other" in:fly={{ y: 20 }}>
				<p>A judge is making the decision...</p>
				<p>Meanshile, tap in a snore so you aren't suspected.</p>
				{#each Object.keys(snorts) as id}
					<div class="item" class:active={selectedSnort === id} on:click={() => (selectedSnort = id)}>{snorts[id]}</div>
				{/each}
			</div>
		{:else if voting}
			<div class="other" in:fly={{ y: 20 }}>
				<p>Well, it doesn't really matter because you can't vote.</p>
			</div>
		{:else if !voting && $self.isOwner}
			<div class="floored">
				<Button on:click={startVote}>Start Vote</Button>
			</div>
		{/if}
	</div>
</Page>

{#if voting}
	<Progress time={10 * 1000} />
{/if}
