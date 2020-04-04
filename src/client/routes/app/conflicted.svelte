<script context="module">
	export const route = {
		name: `app.conflicted`,
		route: `conflicted`,
		queryStringParamaters: ['newGame', 'oldGame'],
		async resolve(_, params) {
			return params;
		},
		defaultParams: {
			newGame: null,
			oldGame: null,
		},
	};
</script>

<script>
	import Page from '../../components/page.svelte';
	import Button from '../../components/button.svelte';

	export let oldGame;
	export let newGame;
</script>

<style>
	.over {
		padding-top: calc(50vh - calc(160px / 2));
	}
</style>

<Page>
	<div class="over container center">
		<h2>We are conflicted.</h2>
		<p>You were already in a game, when you went to another.</p>
		<p>Which game do you want to continue with?</p>
		<Button state="app.game" params={{ id: oldGame }}>Old</Button>
		<span style="padding: 4px">•</span>
		<Button state="app.game" params={{ id: newGame }} on:click={() => localStorage.removeItem(`game-in-progress`)}>New</Button>
	</div>
</Page>
