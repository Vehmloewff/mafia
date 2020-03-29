<script>
	import { createEventDispatcher } from 'svelte';
	import { stateRouter, router } from '../store';

	export let state;
	export let params;
	export let simple = true;
	export let noBackground = false;

	$: url = !state ? null : $stateRouter.makePath(state, params);
	const dispatch = createEventDispatcher();

	function clickLink(e) {
		e.preventDefault();
		$router.go(url);
	}

	function clickButton() {
		dispatch('click');
	}
</script>

<style>
	button {
		padding: 4px 10px;
		border: none;
		border-radius: 3px;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		transition: 0.3s;
		outline: none;
		background: var(--action);
		color: var(--foreground);
	}
	button:active {
		background: var(--action-less);
	}

	button.simple {
		color: var(--action);
		background: rgba(0, 0, 0, 0);
	}
	button.simple:hover {
		background: var(--highlight);
	}
	button.simple:active {
		background: var(--highlight-more);
	}

	button.noBackground {
		background: rgba(0, 0, 0, 0);
	}
	button.noBackground:hover {
		color: var(--action-less);
		background: rgba(0, 0, 0, 0);
	}
</style>

{#if state}
	<a href={url} on:click={clickLink}>
		<button class:simple class:noBackground on:click={clickButton}>
			<slot />
		</button>
	</a>
{:else}
	<button class:simple class:noBackground on:click={clickButton}>
		<slot />
	</button>
{/if}
