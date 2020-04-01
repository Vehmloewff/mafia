<script>
	import { tweened } from 'svelte/motion';
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	export let time;

	const dispatch = createEventDispatcher();

	let progress = tweened(0, {
		duration: time,
	});

	$: {
		if ($progress === 1) dispatch(`done`);
	}

	onMount(() => progress.set(1));

	onDestroy(() => progress.set(0));
</script>

<style>
	.outside {
		position: fixed;
		bottom: 20px;
		right: var(--pack-inset);
		left: var(--pack-inset);
		background: var(--highlight-more);
		box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
		z-index: 10;
		height: 7px;
		border-radius: 3px;
	}
	.progress {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 1;
		background: var(--action);
		border-radius: 3px;
	}
</style>

<div class="outside" transition:fly={{ delay: 1000, y: 300 }}>
	<div class="progress" style="right: {(1 - $progress) * 100}%" />
</div>
