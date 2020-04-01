<script context="module">
	export const route = {
		name: 'app.game.round.snore',
		route: 'snore',
		querystringParameters: [`next`],
		defaultParameters: {
			next: `vote`,
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

	if (next !== 'narrative' && next !== 'vote') {
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
				timeout = setTimeout(() => $stateRouter.go(`app.game.round.${next}`, { id, round }), 200);
			} else {
				playNextSnort();
			}
		}, 2000);
	}

	function playNextSnort() {
		const snort = readySnorts[0];
		if (!snort) return;

		play(snort.url);

		waitABit();
	}

	function getRandomPosition() {
		return `top: ${getRandInteger(0, 100)}%; left: ${getRandInteger(0, 100)}%;`;
	}
</script>

<style>
	.playing-field {
		padding-top: 56px;
		position: relative;
		height: 100vh;
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

<Page slide={true}>
	<div class="playing-field">
		{#each readySnorts as { name }, i}
			<div class="snort" in:scale={{ delay: 2000 * i, duration: 1500 }} style={getRandomPosition()} out:fade>{name}</div>
		{/each}
	</div>
</Page>
