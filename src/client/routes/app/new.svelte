<script context="module">
	export const route = {
		name: `app.new`,
		route: `new`,
	};
</script>

<script>
	import { stateRouter } from '../../store';
	import { onMount } from 'svelte';
	import Loader from '../../components/loader.svelte';
	import Button from '../../components/button.svelte';
	import Page from '../../components/page.svelte';
	import { error } from '../../store';

	onMount(() => {
		fetch(`/api/games`, {
			method: `POST`,
		})
			.then(res => res.text())
			.then(text => $stateRouter.go(`app.game`, { id: text }, { replace: true }))
			.catch(err => {
				console.error(err);
				error.set({ message: null, code: `NETWORK` });
			});
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
		Creating a new game...
		<div style="padding-top: 10px">
			<Button state="app.home">Cancel</Button>
		</div>
	</div>
</Page>
