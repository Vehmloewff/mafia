<script context="module">
	export const route = {
		name: 'app.game.round.selection',
		route: 'selection',
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import Page from '../../../../components/page.svelte';
	import Progress from '../../../../components/progress.svelte';
	import { users, self, currentSocket, messageListener, stateRouter } from '../../../../store';
	import snorts from '../../../../../default-snorts';
	import { narrative, snorts as snortsStore, eliminated } from './store';

	export let id;
	export let round;

	$messageListener = (key, message) => {
		if (key === 'selection') console.log(`Autoselected`, message);
		else if (key === 'narrative') {
			$narrative = message.story;
			$snortsStore = message.snorts;
			$eliminated = message.eliminated;

			$stateRouter.go(`app.game.round.snore`, { next: `narrative`, id, round });
		}
	};

	let active = null;

	function filter(user) {
		if ($self.role === 'mafia') return user.role !== 'mafia' && !user.isDead;
		else return !user.isDead;
	}

	function set(selection) {
		if (selection !== active) {
			$currentSocket.send(`selection`, selection);
			active = selection;
		}
	}
</script>

<style>
	h2 {
		margin-top: calc(20vh + 55px);
	}

	.users {
		padding-top: 30px;
		padding-bottom: 30px;
	}
	.user {
		display: inline-block;
		padding: 5px 8px;
		margin: 16px;
		border-radius: 4px;
		background: var(--action);
		color: var(--foreground-more);
		cursor: pointer;
		user-select: none;
	}
	.user.active {
		opacity: 0.7;
		text-decoration: line-through;
	}
</style>

<Page side={true}>
	<div class="center container">
		<h2>You are a {$self.role}</h2>
		<p>
			{#if $self.role === 'mafia'}
				Who do you want to kill?
			{:else if $self.role === 'doctor'}
				Who do you want to heal?
			{:else if $self.role === 'sheriff'}
				Who do you want to arrest?
			{:else if $self.role === 'villager'}
				Tap in a snort so you're not suspected.
			{:else}
				You'll get to vote on the citizen arrests.
				<div>Meanwhile, tap in a snort so you're not suspected.</div>
			{/if}
		</p>

		<div class="users">
			{#if $self.role === 'mafia' || $self.role === 'doctor' || $self.role === 'sheriff'}
				{#each Array.from($users.values()).filter(filter) as user}
					<div class="user" on:click={() => set(user.id)} class:active={active === user.id}>{user.name}</div>
				{/each}
			{:else}
				{#each Object.keys(snorts) as id}
					<div class="user" on:click={() => set(id)} class:active={active === id}>{snorts[id].name}</div>
				{/each}
			{/if}
		</div>
	</div>
</Page>

<Progress time={10 * 1000} />
