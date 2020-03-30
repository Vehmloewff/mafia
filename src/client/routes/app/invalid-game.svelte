<script context="module">
	export const route = {
		name: `app.invalid-game`,
		route: `invalid-game`,
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import Page from '../../components/page.svelte';
	import Button from '../../components/button.svelte';
	import makeIdReadable from '../../readable-id';

	export let id;
</script>

<style>
	.middle {
		padding-top: 40vh;
	}
</style>

<Page>
	<div class="container center middle">
		<h2 class="text-more">
			Game
			<code>{makeIdReadable(id)}</code>
			is not playable
		</h2>
		<h3>It could have expired or already started</h3>
		<Button state="app.home">Go Home</Button>
		<span style="padding: 4px">•</span>
		<Button state="app.join">Join Another Game</Button>
	</div>
</Page>
