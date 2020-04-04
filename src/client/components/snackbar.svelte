<script context="module">
	import { writable } from 'svelte/store';

	let snacks = writable([]);

	export function createSnackbar(options) {
		snacks.update($snacks => {
			$snacks.push(options);
			return $snacks;
		});
	}
</script>

<script>
	import { fly } from 'svelte/transition';

	let working = false;
	let currentSnack = null;

	snacks.subscribe(_ => {
		if (!working) work();
	});

	function work() {
		working = true;

		if ($snacks.length) {
			currentSnack = $snacks[0];
			setTimeout(async () => {
				$snacks.shift();
				$snacks = $snacks;

				currentSnack = null;

				setTimeout(() => work(), 400);
			}, $snacks[0].time || 3000);
		} else working = false;
	}
</script>

<style>
	.snack {
		position: fixed;
		bottom: 20px;
		right: var(--snack-inset);
		left: var(--snack-inset);
		border-radius: 4px;
		background-color: var(--highlight);
		box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
		padding: 0 10px;
		z-index: 10;
	}
	.text {
		font-size: 16px;
		color: var(--foreground-more);
		padding: 14px 0;
	}
</style>

{#if currentSnack}
	<div class="snack" transition:fly={{ y: 100 }}>
		<div class="text center">{currentSnack.text}</div>
	</div>
{/if}
