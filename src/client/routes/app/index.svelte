<script context="module">
	export const route = {
		name: `app`,
		route: `/`,
		defaultChild: `home`,
	};
</script>

<script>
	import { stateRouter } from '../../store';
	const gameInProgress = localStorage.getItem(`game-in-progress`);

	if (gameInProgress) $stateRouter.go(`app.game.resume`, { id: gameInProgress }, { replace: true });
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
