<script>
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let ready = false;
	onMount(() => {
		ready = true;
	});

	export let side = false;
	export let delay = 0;
</script>

{#if ready}
	<div class="page" in:fly={{ y: side ? 0 : 30, x: side ? 50 : 0, duration: 1000, delay }}>
		<slot />
	</div>
{/if}
