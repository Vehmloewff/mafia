<script context="module">
	export const route = {
		name: 'app.what-is-this',
		route: 'what-is-this',
	};
</script>

<script>
	import BackButton from '../../components/back-button.svelte';
	import Navbar from '../../components/navbar.svelte';
	import Page from '../../components/page.svelte';
</script>

<Navbar left={10} middle={-8} slide={true}>
	<div slot="left">
		<span class="container">
			<BackButton label="Home" state="app.home" />
		</span>
	</div>
	<div slot="middle">
		<span>
			<h2>What is this</h2>
		</span>
	</div>
</Navbar>

<Page />
