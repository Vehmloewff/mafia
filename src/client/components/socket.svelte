<script>
	import { currentSocket } from '../store';
	import Button from './button.svelte';
</script>

<style>
	.center {
		padding-top: calc(50vh - 120px);
	}
</style>

{#if $currentSocket}
	<slot />
{:else}
	<div class="center container">
		<h2 class="text-more">That's wierd.</h2>
		<p>Somehow you landed on a socket page without one.</p>
		<p>
			<Button state="app.home">Go Home</Button>
		</p>
	</div>
{/if}
