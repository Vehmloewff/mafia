<script>
	import { currentSocket } from '../store';
	import Button from './button.svelte';
</script>

<style>
	.cover {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: var(--background);
		z-index: 10;
	}
	.center {
		padding-top: calc(50vh - 120px);
	}
</style>

{#if $currentSocket}
	<slot />
{:else}
	<div class="cover">
		<div class="center container">
			<h2 class="text-more">That's wierd.</h2>
			<p>Somehow you landed on a socket page without one.</p>
			<p>
				<Button state="app.home">Go Home</Button>
			</p>
		</div>
	</div>
{/if}
