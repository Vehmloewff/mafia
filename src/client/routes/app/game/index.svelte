<script context="module">
	export const route = {
		name: 'app.game',
		route: 'game/:id',
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import { stateRouter } from '../../../store';

	export let id;

	const currentGame = localStorage.getItem('game-in-progress');

	if (!currentGame) $stateRouter.go('app.game.verify', { id }, { replace: true });
	else $stateRouter.go('app.game.resume', { id }, { replace: true });
</script>

<uiView />
