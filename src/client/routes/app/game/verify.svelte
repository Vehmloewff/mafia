<script context="module">
	export const route = {
		name: `app.game.verify`,
		route: `verify`,
		async resolve(_, { id }) {
			return { id };
		},
	};
</script>

<script>
	import { onMount } from 'svelte';
	import { stateRouter } from '../../../store';
	import gameIsValid from '../../../verify-game';
	import Loader from '../../../components/loader.svelte';
	import Button from '../../../components/button.svelte';
	import Page from '../../../components/page.svelte';

	export let id;

	onMount(async () => {
		if (await gameIsValid(id)) {
			$stateRouter.go(`app.game.self`, { id }, { replace: true });
		} else {
			$stateRouter.go(`app.invalid-game`, { id }, { replace: true });
		}
	});
</script>

<style>
	.center {
		padding-top: calc(50vh - 79px);
	}
</style>

<Page delay={100}>
	<div class="center">
		<div style="padding-bottom: 18px">
			<Loader />
		</div>
		Verifying game...
		<div style="padding-top: 10px">
			<Button state="app.home">Cancel</Button>
		</div>
	</div>
</Page>
