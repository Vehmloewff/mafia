<script>
	import { users, self } from '../store';
	import crown from '../icons/crown.svg';

	export let id;
	export let defaultFull = true;

	let nameWidth;
	let overWidth;
	let full = defaultFull;

	function nameSafe(str) {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/ /g, '&nbsp;');
	}

	$: user = $users.get(id);
	$: shouldBlur = !user.role && !!$self.role;
	$: name = user && user.name && nameSafe(user.name);
</script>

<style>
	.over {
		display: inline-block;
		position: relative;
		user-select: none;
		cursor: pointer;
	}
	.over.dead {
		opacity: 0.7;
	}
	.over.dead .name-over {
		text-decoration: line-through;
	}
	.over.dead .role {
		text-decoration: line-through;
	}

	.name,
	.name-over {
		background: var(--action);
		border-radius: 4px 0 0 4px;
		padding: 6px 3px 5px 9px;
		font-weight: bold;
		float: left;
		overflow: hidden;
		height: 19px;
	}
	.name {
		color: rgba(0, 0, 0, 0);
	}
	.name-over {
		color: var(--foreground-more);
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		bottom: 0;
		text-align: center;
		transition: right 300ms, border 300ms, padding 300ms;
	}
	.name-over.full {
		padding-right: 0;
		padding-left: 0;
		border-radius: 4px;
	}

	.role {
		float: left;
		overflow: hidden;
		border: 1px solid var(--action);
		border-radius: 0 4px 4px 0;
		color: var(--foreground);
		height: 18px;
		padding: 5px 9px 5px 3px;
	}

	span.blur {
		filter: blur(4px);
	}

	.crown {
		width: 16px;
		height: 16px;
		position: absolute;
		top: -6px;
		right: -6px;
		z-index: 2;
		color: #e6a756;
	}
</style>

<div class="over" on:click={() => (full = !full)} bind:offsetWidth={overWidth} class:dead={user.isDead}>
	<div class="name-over" style="right: {full ? 0 : overWidth - nameWidth}px" class:full>
		{@html name}
	</div>
	<div class="name" bind:offsetWidth={nameWidth}>
		{@html name}
	</div>
	<div class="role">
		<span class:blur={shouldBlur}>{shouldBlur ? 'unknown' : user.role || 'not assigned'}</span>
	</div>
	{#if user.isOwner}
		<div class="crown">
			{@html crown}
		</div>
	{/if}
</div>
