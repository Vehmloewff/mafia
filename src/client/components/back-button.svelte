<script>
	import Button from './button.svelte';
	import backIcon from '../icons/back.svg';
	import Icon from './icon.svelte';

	export let label;
	export let state;
	export let params;
</script>

<style>
	.label {
		display: inline-block;
		position: relative;
		top: -3px;
		right: 7px;
	}
</style>

<Button {state} noBackground={true} {params}>
	<Icon icon={backIcon} color="action" />
	{#if label}
		<div class="label">{label}</div>
	{/if}
</Button>
