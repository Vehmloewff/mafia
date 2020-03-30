<script context="module">
	export const route = {
		name: 'app.game.pre-start',
		route: 'pre-start',
	};
</script>

<script>
	import Button from '../../../components/button.svelte';
	import Page from '../../../components/page.svelte';
	import { users, self, owner } from '../../../store';
	import { playersNeeded, setOwner, makeIdReadable } from '../../../services';
	import { onMount } from 'svelte';
	import UserChip from '../../../components/user-chip.svelte';
	import Navbar from '../../../components/navbar.svelte';

	let usersNeeded = 0;

	onMount(() => {
		if ($self.isOwner) {
			users.subscribe(() => (usersNeeded = playersNeeded()));
		}
	});

	function copy() {
		document.execCommand('copy');
	}
</script>

<style>
	.nav-item {
		padding: 4px;
	}
	.middle {
		height: 1px;
	}

	.header {
		padding: 35px;
	}
	/* .invite .code {
		font-size: 24px;
		color: var(--action);
		margin-bottom: 20px;
	}
	.code,
	.link {
		user-select: all;
	} */

	.users,
	.message {
		float: left;
		width: 50%;
	}
	.message {
		color: var(--foreground-less);
		font-size: 14px;
		text-align: center;
	}
	.card {
		border-radius: 4px;
		background: var(--midground);
		margin: 8px;
		overflow: hidden;
	}
	.space {
		padding: 5px 8px;
	}

	@media (max-width: 700px) {
		.middle {
			height: 0px;
		}
		.users,
		.message {
			width: 100%;
		}
	}
</style>

<Navbar left={-8} right={14}>
	<div slot="left">
		<h2 class="container">Mafia</h2>
	</div>
	<div slot="middle" class="middle" />
	<div slot="right">
		<span class="nav-item">
			<Button>invite</Button>
		</span>
		<span class="nav-item">
			<Button>settings</Button>
		</span>
	</div>
</Navbar>
<Page>
	<div class="container">
		<div class="header">
			<!-- <div class="invite">
				<h3>Invite your friends so they can play too!</h3>
				<div class="code" on:click={copy}>
					<code>{makeIdReadable(id)}</code>
				</div>
				<div class="link" on:click={copy}>
					<code>{location.protocol}//{location.host}/game/{id}</code>
				</div>
			</div> -->
		</div>

		<div class="message">
			<div class="card container" style="padding-top: 30px; padding-bottom: 30px;">
				{#if $self.isOwner}
					<Button disabled={usersNeeded}>Start Game</Button>
					{#if usersNeeded}
						<div style="padding-top: 8px">
							<span>Waiting for at least {usersNeeded} more {usersNeeded === 1 ? `user` : `users`}...</span>
						</div>
					{:else}All set! You can start the game whenever.{/if}
				{:else}Waiting for {$owner}{$users.get($owner).name} to start the game...{/if}
			</div>
		</div>

		<div class="users center">
			<div class="card container" style="padding-bottom: 20px;">
				<h2>Users</h2>

				{#each Array.from($users.values()) as user}
					<span class="space">
						<UserChip id={user.id} defaultFull={true} />
					</span>
				{/each}
			</div>
		</div>
	</div>
</Page>
