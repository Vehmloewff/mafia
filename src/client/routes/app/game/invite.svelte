<script context="module">
	export const route = {
		name: `app.game.invite`,
		route: `invite`,
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import Navbar from '../../../components/navbar.svelte';
	import BackButton from '../../../components/back-button.svelte';
	import Page from '../../../components/page.svelte';
	import { makeIdReadable } from '../../../services';
	import Socket from '../../../components/socket.svelte';
	import { createSnackbar } from '../../../components/snackbar.svelte';

	export let id;

	function copy(isLink = false) {
		document.execCommand('copy');
		createSnackbar({
			text: `${isLink ? 'Link' : 'Id'} copied to clipboard!`,
		});
	}
</script>

<style>
	.invite {
		padding-top: calc(50vh - calc(233px / 2));
	}
	.invite .code {
		font-size: 24px;
		color: var(--action);
		margin-bottom: 20px;
	}
	.code,
	.link {
		user-select: all;
	}
</style>

<Socket>
	<Navbar left={10} middle={-5}>
		<div slot="left">
			<span class="container">
				<BackButton label="Mafia" state="app.game.pre-start" params={{ id }} />
			</span>
		</div>
		<div slot="middle">
			<span>
				<h2>Invite</h2>
			</span>
		</div>
	</Navbar>

	<Page>
		<div class="invite container center">
			<h2>Invite your family and friends to this game</h2>
			<p>They can use this game id to join:</p>
			<div class="code" on:click={_ => copy(false)}>
				<code>{makeIdReadable(id)}</code>
			</div>
			<p style="padding-top: 20px;">Or, they can just use this link:</p>
			<div class="link" on:click={_ => copy(true)}>
				<pre>
					<code>{location.protocol}//{location.host}/game/{id}</code>
				</pre>
			</div>
		</div>
	</Page>
</Socket>
