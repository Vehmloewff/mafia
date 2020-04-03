<script>
	import { onMount } from 'svelte';

	export let message;
	export let code;
	export let error;

	onMount(() => {
		console.error(error);
	});
</script>

<style>
	.over {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: var(--background);
		color: var(--foreground);
		padding-top: 40vh;
	}
	.inner {
		max-width: 600px;
		margin: auto;
	}
</style>

<div class="over">
	<div class="inner">
		<p>
			Error:
			<code>{message}</code>
		</p>
		<p>
			Code:
			<code>{code}</code>
		</p>
	</div>
</div>
