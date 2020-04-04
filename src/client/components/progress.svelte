<script>
	import { tweened } from 'svelte/motion';
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

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
		bottom: 0;
		right: 0;
		left: 0;
		background: var(--highlight-more);
		z-index: 10;
		height: 3px;
	}
	.progress {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 1;
		background: var(--action);
	}
</style>

<div class="outside" transition:fade={{ delay: 500 }}>
	<div class="progress" style="right: {(1 - $progress) * 100}%" />
</div>
