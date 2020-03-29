<script>
	import { createEventDispatcher } from 'svelte';
	import { stateRouter, router } from '../store';

	export let state;
	export let params;
	export let simple = true;
	export let noBackground = false;
	export let forceButton = false;
	export let disabled = false;

	$: url = !state ? null : $stateRouter.makePath(state, params);
	const dispatch = createEventDispatcher();

	function clickLink(e) {
		e.preventDefault();
		$router.go(url);
	}

	function clickButton(e) {
		dispatch('click', e);
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
		outline: none;
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

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	a {
		outline: none;
	}
</style>

{#if state}
	<a href={url} on:click={clickLink}>
		<button class:simple class:noBackground on:click={clickButton} type={forceButton ? 'button' : null} {disabled}>
			<slot />
		</button>
	</a>
{:else}
	<button class:simple class:noBackground on:click={clickButton} type={forceButton ? 'button' : null} {disabled}>
		<slot />
	</button>
{/if}
