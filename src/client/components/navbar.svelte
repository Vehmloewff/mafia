<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let left = 0;
	export let middle = 0;
	export let right = 0;
	export let slide = false;

	let ready = !slide;

	onMount(() => (ready = true));
</script>

<style>
	.nav {
		background: var(--midground);
		height: 55px;
		border-bottom: 1px solid var(--sharp);
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
	}
	.inner {
		max-width: 1000px;
		margin: auto;
	}

	.left {
		text-align: left;
		float: left;
		width: 33.3%;
	}
	.middle {
		text-align: center;
		float: left;
		width: 33.3%;
	}
	.right {
		text-align: right;
		float: right;
	}
	.int {
		position: relative;
	}
	.placeholder {
		height: 10px;
		width: 33.3%;
	}
</style>

{#if ready}
	<div class="nav" in:fly={{ y: -55, delay: 300 }}>
		<div class="inner">
			<div class="left ext">
				<div class="int" style="top: {left}px">
					<slot name="left">
						<div class="placeholder" />
					</slot>
				</div>
			</div>
			<div class="middle ext">
				<div class="int" style="top: {middle}px">
					<slot name="middle">
						<div class="placeholder" />
					</slot>
				</div>
			</div>
			<div class="right ext">
				<div class="int" style="top: {right}px">
					<slot name="right">
						<div class="placeholder" />
					</slot>
				</div>
			</div>
		</div>
	</div>
{/if}
