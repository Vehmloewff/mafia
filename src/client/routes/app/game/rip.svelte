<script context="module">
	export const route = {
		name: `app.game.rip`,
		route: `rip`,
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import { messageListener, stateRouter } from '../../../store';

	export let id;

	$messageListener = (key, message) => {
		if (key === 'game-over') {
			message.forEach(user => {
				users.update($users => {
					$users.set(user.id, user);
					return $users;
				});
			});
			$stateRouter.go('app.game.game-end', { id });
		}
	};
</script>

<style>
	.center {
		margin-top: calc(50vh - calc(66px / 2));
	}
</style>

<div class="center container">
	<h2>Rest In Peace</h2>
	<p>We'll let you know when the game is over.</p>
</div>
