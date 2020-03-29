<script context="module">
	export const route = {
		name: `app`,
		route: `/`,
		defaultChild: `home`,
	};
</script>

<style>
	.app {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: var(--background);
		color: var(--foreground-less);
	}
</style>

<div class="app">
	<div class="centered">
		<uiView />
	</div>
</div>
