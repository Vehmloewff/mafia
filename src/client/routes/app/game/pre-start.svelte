<script context="module">
	export const route = {
		name: 'app.game.pre-start',
		route: 'pre-start',
		async resolve(_, params) {
			return params;
		},
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
	import Socket from '../../../components/socket.svelte';
	import Icon from '../../../components/icon.svelte';
	import settings from '../../../icons/settings.svg';
	import invite from '../../../icons/invite.svg';

	let usersNeeded = 0;

	export let id;

	onMount(() => {
		if ($self.isOwner) {
			users.subscribe(() => (usersNeeded = playersNeeded()));
		}
	});
</script>

<style>
	.nav-item {
		padding: 4px;
	}
	.middle {
		height: 1px;
	}
	.icon {
		position: relative;
		/* top: 3px; */
	}

	.header {
		padding: 35px;
	}
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

<Socket>
	<Navbar left={-8} right={14} slide={true}>
		<div slot="left">
			<h2 class="container">Mafia</h2>
		</div>
		<div slot="middle" class="middle" />
		<div slot="right">
			<div class="container">
				<span class="nav-item">
					<Button state="app.game.invite" params={{ id }}>
						<span class="icon">
							<Icon icon={invite} size={20} />
						</span>
					</Button>
				</span>
				{#if $self.isOwner}
					<span class="nav-item">
						<Button state="app.game.settings" params={{ id }}>
							<span class="icon">
								<Icon icon={settings} size={20} />
							</span>
						</Button>
					</span>
				{/if}
			</div>
		</div>
	</Navbar>
	<Page>
		<div class="container">
			<div class="header" />

			<div class="message">
				<div class="card container" style="padding-top: 30px; padding-bottom: 30px;">
					{#if $self.isOwner}
						<div style="padding-bottom: 8px">
							<Button disabled={usersNeeded}>Start Game</Button>
						</div>
						{#if usersNeeded}
							<span>Waiting for at least {usersNeeded} more {usersNeeded === 1 ? `user` : `users`}...</span>
						{:else}All set! You can start the game whenever.{/if}
					{:else}Waiting for {$users.get($owner).name} to start the game...{/if}
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
</Socket>
