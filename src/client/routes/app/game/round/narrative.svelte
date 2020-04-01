<script context="module">
	export const route = {
		name: 'app.game.round.narrative',
		route: 'narrative',
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import Page from '../../../../components/page.svelte';
	import Progress from '../../../../components/progress.svelte';
	import UserChip from '../../../../components/user-chip.svelte';
	import { narrative, eliminated, trial } from './store';
	import { users, self, currentSocket, messageListener, stateRouter } from '../../../../store';

	const arrestedTest = /^.+ what do you have to say for (yourself|yourselves)\?$/;

	export let id;
	export let round;

	$: paragraphs = insertEliminated($narrative.split('\n\n'));

	$eliminated.forEach(({ id, role }) => {
		if ($self.id === id) $self.isDead = true;

		const old = $users.get(id);
		old.role = role;
		old.isDead = true;
		$users.set(id, old);

		$users = $users;
	});

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

	function insertEliminated(lines) {
		let index = lines.findIndex(line => arrestedTest.test(line));

		if (index === -1) index = lines.length - 1;

		lines.splice(index, 0, `$ELIMINATED$`);

		return lines;
	}

	function next() {
		if ($self.isOwner && $currentSocket) $currentSocket.send(`next`);
	}
</script>

<style>

</style>

<Page slide={true}>
	<div class="container">
		<h2 class="center" style="padding-top: 100px">Narrative</h2>
		{#each paragraphs as line}
			{#if line === '$ELIMINATED$'}
				<p class="center" style="padding-top: 40px; padding-bottom: 40px;">
					{#each $eliminated as { id }}
						<UserChip {id} defaultFull={false} />
					{/each}
				</p>
			{:else}
				<p>{line}</p>
			{/if}
		{/each}
		<div style="padding-bottom: 100px;" />

		<Progress on:done={next} time={paragraphs.length * 1000 * 10} />
	</div>
</Page>
