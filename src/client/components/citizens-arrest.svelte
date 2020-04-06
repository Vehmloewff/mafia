<script>
	import { self } from '../store';
	import Button from './button.svelte';
</script>

<style>
	.badge {
		background: #951d1d;
		border-radius: 50%;
		display: inline-block;
		width: 20px;
		height: 20px;
		line-height: 20px;
		color: rgb(209, 200, 200);
		margin-left: 5px;
	}
</style>

<Button disabled={!$self.citizensArrestsLeft}>
	Citizens Arrest
	{#if $self.citizensArrestsLeft}
		<div class="badge">{$self.citizensArrestsLeft}</div>
	{/if}
</Button>
