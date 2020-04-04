<script>
	import { users, self, currentSocket } from '../store';

	let selection = null;

	export const onOkClick = () => {
		$self.isOwner = false;

		$users.forEach(user => {
			if (user.id === $self.id) user.isOwner = false;
			if (user.id === selection) user.isOwner = true;

			$users.set(user.id, user);
		});

		$currentSocket.send(`owner-defer`, selection);
	};

	export let okDisabled = true;
</script>

<style>
	.select {
		display: inline-block;
		padding: 5px 8px;
		margin: 6px;
		border-radius: 4px;
		border: 2px solid var(--foreground-more);
		color: var(--foreground-more);
		cursor: pointer;
		user-select: none;
		transition: color 300ms, background 300ms;
	}
	.select.active {
		border: 2px solid rgba(0, 0, 0, 0);
		color: var(--foreground-more);
		background: var(--action);
	}
</style>

<p>Dead people can't be game owners.</p>
<p class="center">
	{#each Array.from($users.values()).filter(user => !user.isDead && user.id !== $self.id) as { name, id }}
		<div
			class="select"
			class:active={selection === id}
			on:click={() => {
				selection = id;
				okDisabled = false;
			}}>
			{name}
		</div>
	{/each}
</p>
