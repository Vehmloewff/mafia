<script>
	import Button from './button.svelte';
	import backIcon from '../icons/back.svg';
	import Icon from './icon.svelte';

	export let label;
	export let state;
</script>

<style>
	.label {
		display: inline-block;
		position: relative;
		top: -6px;
		right: 7px;
	}
</style>

<Button {state} noBackground={true}>
	<Icon icon={backIcon} color="action" />
	{#if label}
		<div class="label">{label}</div>
	{/if}
</Button>
