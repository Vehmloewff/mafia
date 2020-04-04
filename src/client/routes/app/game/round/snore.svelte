<script context="module">
	export const route = {
		name: 'app.game.round.snore',
		route: 'snore',
		querystringParameters: [`next`],
		defaultParameters: {
			next: `vote-result`,
		},
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { snorts } from './store';
	import { stateRouter } from '../../../../store';
	import { fade, fly, scale } from 'svelte/transition';
	import { getRandInteger } from '../../../../../utils';
	import allSnorts from '../../../../../game/default-snorts';
	import Page from '../../../../components/page.svelte';
	import { load, play } from '../../../../audio';

	export let id;
	export let round;
	export let next;

	let innerHeight;
	let innerWidth;

	if (next !== 'narrative' && next !== 'vote-result') {
		console.log('invalid next', next);
		next = 'vote';
	}

	let timeout;
	let readySnorts = $snorts.map(id => {
		const snore = allSnorts[id];
		load(snore.url);

		return snore;
	});

	onMount(() => playNextSnort());

	onDestroy(() => clearTimeout(timeout));

	function waitABit() {
		timeout = setTimeout(() => {
			readySnorts.shift();
			readySnorts = readySnorts;

			if (!readySnorts.length) {
				timeout = setTimeout(done, 200);
			} else {
				playNextSnort();
			}
		}, 2000);
	}

	function playNextSnort() {
		const snort = readySnorts[0];
		if (!snort) return done();

		play(snort.url);

		waitABit();
	}

	function done() {
		$stateRouter.go(`app.game.round.${next}`, { id, round });
	}

	function getRandomPosition() {
		return `top: ${getRandInteger(0, innerHeight - 200)}px; left: ${getRandInteger(0, innerWidth - 200)}px;`;
	}
</script>

<style>
	.playing-field {
		padding-top: 56px;
		position: relative;
		height: 100vh;
		overflow: hidden;
	}

	.snort {
		background: var(--highlight-more);
		border-radius: 50%;
		width: 200px;
		height: 200px;
		position: absolute;
		color: var(--action);
		font-size: 14px;
		line-height: 200px;
		text-align: center;
	}
</style>

<svelte:window bind:innerHeight bind:innerWidth />

<Page slide={true}>
	<div class="playing-field">
		{#each readySnorts as { name }, i}
			<div class="snort" in:scale={{ delay: 2000 * i, duration: 1500 }} style={getRandomPosition()} out:fade>{name}</div>
		{/each}
	</div>
</Page>
