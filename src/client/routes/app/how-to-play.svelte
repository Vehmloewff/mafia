<script context="module">
	export const route = {
		name: 'app.how-to-play',
		route: 'how-to-play',
	};
</script>

<script>
	import BackButton from '../../components/back-button.svelte';
	import Navbar from '../../components/navbar.svelte';
	import Page from '../../components/page.svelte';
</script>

<Navbar left={10} middle={-5} slide={true}>
	<div slot="left">
		<span class="container">
			<BackButton label="Home" state="app.home" />
		</span>
	</div>
	<div slot="middle">
		<span>
			<h2>How&nbsp;to&nbsp;play</h2>
		</span>
	</div>
</Navbar>

<Page />
