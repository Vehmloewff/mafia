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
	import UserChip from '../../../../components/user-chip.svelte';
	import { narrative, eliminated, trial } from './store';
	import { users, self, currentSocket, messageListener, stateRouter } from '../../../../store';
	import { nextListener, callNext } from '../../../../services';

	const arrestedTest = /^.+ what do you have to say for (yourself|yourselves)\?$/;

	export let id;
	export let round;

	$: paragraphs = $narrative.split('\n\n');

	$eliminated.forEach(({ id, role }) => {
		if ($self.id === id) $self.isDead = true;

		const old = $users.get(id);
		old.role = role;
		old.isDead = true;
		$users.set(id, old);

		$users = $users;
	});

	$messageListener = nextListener(id, round);

	function next() {
		if ($self.isOwner && $currentSocket) callNext();
	}
</script>

<style>

</style>

<Page side={true}>
	<div class="container">
		<h2 class="center text-more" style="padding-top: 100px">What's new?</h2>
		{#each paragraphs as line}
			<p>{line}</p>
		{/each}
		<p class="center" style="padding-top: 40px">
			{#each $eliminated as { id }}
				<UserChip {id} defaultFull={false} />
			{/each}
		</p>
		<div style="padding-bottom: 100px;" />
	</div>
</Page>
