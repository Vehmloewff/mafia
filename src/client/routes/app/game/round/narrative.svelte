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
	import Button from '../../../../components/button.svelte';
	import { narrative, eliminated, trial } from './store';
	import { users, self, currentSocket, messageListener, stateRouter, owner } from '../../../../store';
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
</script>

<style>
	.personal-space {
		display: inline-block;
		padding: 16px;
	}
</style>

<Page side={true}>
	<div class="container">
		<h2 class="center text-more" style="padding-top: 100px">What's new?</h2>
		{#each paragraphs as line}
			<p>{line}</p>
		{/each}
		<p class="center" style="padding-top: 40px">
			{#each $eliminated as { id }}
				<div class="personal-space">
					<UserChip {id} defaultFull={false} />
				</div>
			{/each}
		</p>
		<div style="padding: 100px 0;" class="center">
			{#if $self.isOwner}
				<Button on:click={callNext}>Next Page</Button>
			{:else}
				<span class="text-less">Waiting for {$users.get($owner).name} to move us on...</span>
			{/if}
		</div>
	</div>
</Page>
