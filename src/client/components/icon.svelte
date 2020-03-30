<script>
	export let icon;
	export let size = 24;
</script>

<style>
	div {
		display: inline-block;
		position: relative;
		top: 3px;
	}
</style>

<div style="width: {size}px; height: {size}px;">
	{@html icon}
</div>
