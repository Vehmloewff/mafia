<script>
	import { users, self } from '../store';

	let selection = null;

	export const onOkClick = () => {
		$self.isOwner = false;

		$users.forEach(user => {
			if (user.id === $self.id) user.isOwner = false;
			if (user.id === selection) user.isOwner = true;

			$users.set(user.id, user);
		});
	};

	export let okDisabled = true;
</script>

<style>
	.select {
		display: inline-block;
		padding: 5px 8px;
		margin: 16px;
		border-radius: 4px;
		background: var(--action);
		color: var(--foreground-more);
		cursor: pointer;
		user-select: none;
	}
	.select.active {
		opacity: 0.7;
		text-decoration: line-through;
	}
</style>

<div class="container center">
	<p>
		{#each Array.from($users.values).filter(user => !user.isDead && user.id !== $self.id) as { name, id }}
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
</div>
