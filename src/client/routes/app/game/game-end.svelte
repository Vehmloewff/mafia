<script context="module">
	export const route = {
		name: 'app.game.game-end',
		route: 'game-end',
	};
</script>

<script>
	import { users, self } from '../../../store';
	import UserChip from '../../../components/user-chip.svelte';

	$: mafias = Array.from($users.values()).filter(user => user.role === 'mafia' && !user.isDead);
</script>

<style>
	.header {
		padding-top: 80px;
	}
	.users {
		padding-top: 25px;
	}
	.user-space {
		display: inline-block;
		padding: 16px;
	}
</style>

<div class="center container">
	<h2 class="header">Game Over</h2>
	<p>
		{#if mafias.length}The mafia triumphed!{:else}The mafia was smashed!{/if}
	</p>
	<h3>
		{#if ($self.role === 'mafia' && mafias.length) || ($self.role !== 'mafia' && !mafias.length)}You won{:else}You lost{/if}
	</h3>
	<div class="users">
		{#each Array.from($users.values()) as { id }}
			<div class="user-space">
				<UserChip defaultFull={true} {id} />
			</div>
		{/each}
	</div>
</div>
