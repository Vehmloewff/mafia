<script context="module">
	export const route = {
		name: `app.game.round`,
		route: `round/:round`,
		defaultChild: `selection`,
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import Page from '../../../../components/page.svelte';
	import Navbar from '../../../../components/navbar.svelte';
	import Socket from '../../../../components/socket.svelte';
	import Button from '../../../../components/button.svelte';
	import UserChip from '../../../../components/user-chip.svelte';
	import Icon from '../../../../components/icon.svelte';
	import { timeLeft, users } from '../../../../store';
	import playersIcon from '../../../../icons/players.svg';
	import clockIcon from '../../../../icons/clock.svg';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let round;

	let openDrawer = false;
	let ready = false;
	let width;

	onMount(() => (ready = true));
</script>

<style>
	.nav-item {
		padding-left: 10px;
	}
	.time {
		font-size: 20px;
		padding-right: 20px;
		color: var(--foreground-more);
	}
	.time .icon {
		color: var(--foreground-less);
		position: relative;
		bottom: 2px;
	}

	.drawer {
		width: 300px;
		background: var(--midground);
		position: fixed;
		top: 0;
		left: -305px;
		bottom: 0;
		z-index: 9;
		box-shadow: 2px 0 4px 1px rgba(0, 0, 0, 0.2);
		transition: left 300ms;
	}
	.drawer.out {
		left: 0;
	}
	.drawer .header {
		height: 150px;
		text-align: center;
		padding-top: 50px;
		background: var(--background);
		border-bottom: 1px solid var(--sharp);
	}
	.drawer .main {
		height: calc(100vh - 201px);
		text-align: center;
		padding-bottom: 30px;
		overflow: auto;
	}
	.cover {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 8;
		background: rgba(0, 0, 0, 0.2);
	}

	@media (min-width: 1100px) {
		.drawer {
			box-shadow: unset;
			border-right: 1px solid var(--sharp);
			left: 0;
		}
	}
</style>

<svelte:head>
	<style>
		@media (min-width: 1100px) {
			.app {
				left: 301px !important;
				transition: left 500ms;
			}
			.nav {
				left: 301px !important;
				transition: left 500ms;
			}
		}
		.centered {
			max-width: 800px !important;
			transition: max-width 300ms;
		}
		.nav .inner {
			max-width: 800px !important;
			transition: max-width 300ms;
		}
	</style>
</svelte:head>

<svelte:window bind:innerWidth={width} />

<uiView />

<Socket>
	<Navbar middle={-5} left={10} right={-10}>
		<div slot="left">
			<span class="nav-item">
				{#if width < 1100}
					<Button on:click={() => (openDrawer = true)}>
						<Icon icon={playersIcon} size={25} />
					</Button>
				{/if}
			</span>
		</div>
		<div slot="middle" class="middle">
			<h2 class="container">Round&nbsp;{round}</h2>
		</div>
		<div slot="right">
			<h4 class="time">
				{#if $timeLeft}
					<span class="icon">
						<Icon icon={clockIcon} size={16} />
					</span>
					{$timeLeft}
				{/if}
			</h4>
		</div>
	</Navbar>

	{#if openDrawer}
		<div class="cover" in:fade on:click={() => (openDrawer = false)} />
	{/if}
	{#if ready}
		<div class="drawer" class:out={openDrawer} transition:fly={{ x: -300 }}>
			<div class="header">
				<Icon icon={playersIcon} size={100} />
			</div>
			<div class="main">
				{#each Array.from($users.values()) as user}
					<div class="line center container" style="padding-top: 16px;">
						<UserChip id={user.id} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</Socket>
