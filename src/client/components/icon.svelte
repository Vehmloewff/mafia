<script>
	export let icon;
	export let size = 24;
</script>

<style>
	div {
		display: inline-block;
	}
</style>

<div style="width: {size}px; height: {size}px;">
	{@html icon}
</div>
