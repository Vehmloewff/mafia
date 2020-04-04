<script context="module">
	export const route = {
		name: `app.home`,
		route: `/home`,
	};
</script>

<script>
	import Button from '../../components/button.svelte';
	import Page from '../../components/page.svelte';
	import { currentSocket } from '../../store';

	if ($currentSocket) {
		$currentSocket.destroy();
		$currentSocket = null;
	}
</script>

<style>
	.over {
		min-height: 100vh;
	}

	header {
		padding-top: 20vh;
		padding-bottom: 20vh;
	}
	main div {
		text-align: center;
		padding: 8px;
		padding-bottom: 100px;
	}
</style>

<Page>
	<div class="over">
		<header>
			<h1 class="text-more container center">Mafia</h1>
			<p class="container center">
				<Button state="app.what-is-this">What is this</Button>
				<span style="padding: 4px">•</span>
				<Button state="app.how-to-play">How to play</Button>
			</p>
		</header>

		<main>
			<div>
				<Button simple={false} state="app.join">Join a Game</Button>
			</div>
			<div>- or -</div>
			<div>
				<Button state="app.new">Create a Game</Button>
			</div>
		</main>
	</div>
</Page>
