<script context="module">
	export const route = {
		name: `app.join`,
		route: `join`,
	};
</script>

<script>
	import { onMount } from 'svelte';
	import { gameStatus } from '../../verify-game.ts';
	import Button from '../../components/button.svelte';

	let char1 = ``;
	let char2 = ``;
	let char3 = ``;
	let char4 = ``;
	let char5 = ``;
	let char6 = ``;

	let input1;
	let input2;
	let input3;
	let input4;
	let input5;
	let input6;

	let verifying = false;
	let buttonText = null;
	let message = null;
	let didError = false;

	$: inputs = [input1, input2, input3, input4, input5, input6];
	$: chars = [char1, char2, char3, char4, char5, char6];
	$: nextStep(chars, inputs);
	$: gameId = chars.join('');

	onMount(() => input1.focus());

	let lastLength = null;
	function nextStep(arr, inputs) {
		if (lastLength === null) return (lastLength = 0);

		const thisLength = arr.filter(text => text !== '' && text !== undefined).length;

		if (thisLength === 6) verify();
		else if (thisLength > lastLength) inputs[thisLength].focus();

		lastLength = thisLength;

		buttonText = null;
		message = null;
		didError = false;
	}

	async function verify() {
		verifying = true;

		const status = await gameStatus(gameId);

		if (status === 'ok') {
			buttonText = 'Join Game';
			message = 'Looks good!';
		} else if (status === 'started') {
			buttonText = 'Resume';
			message = 'You have already started this game';
		} else {
			message = 'Invalid game!';
			didError = true;
		}

		verifying = false;
	}

	function onKeyUp(e, index) {
		if (e.key === 'Backspace' || e.key === 'Delete') {
			if (index !== 1) inputs[index - 2].focus();
		} else if (e.key === 'ArrowRight' && index !== 6) {
			inputs[index].focus();
		} else if (e.key === 'ArrowLeft' && index !== 1) {
			inputs[index - 2].focus();
		}
	}

	function onKeyDown(e) {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			e.preventDefault();
		}
	}
</script>

<style>
	.input-container {
		display: inline-block;
		width: 30px;
		margin: 8px;
		border-radius: 4px 4px 0 0;
		border-bottom: 2px solid var(--foreground);
	}
	input {
		background: rgba(0, 0, 0, 0);
		color: var(--foreground-more);
		border: none;
		width: 100%;
		font-size: 20px;
		text-align: center;
	}

	/* Hide the arrows on the input */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield;
	}
	.input-container:focus-within {
		border-bottom: 2px solid var(--action);
		background-color: var(--highlight-less);
	}

	.space {
		display: inline-block;
		font-size: 20px;
		color: var(--foreground-more);
	}

	.message {
		padding-top: 10px;
		padding-bottom: 10px;
		color: green;
	}
	.message.error {
		color: red;
	}

	.actions {
		text-align: left;
	}

	@media (max-width: 350px) {
		.container {
			padding-right: 5px;
			padding-left: 5px;
		}
	}
</style>

<div class="container center" style="max-width: 320px; margin: auto; margin-top: calc(50vh - calc(220px / 2))">
	<h2>Join</h2>
	<p>Enter the game id</p>
	<div class="inputs">
		<div class="input-container">
			<input
				type="number"
				bind:value={char1}
				bind:this={input1}
				on:keyup={e => onKeyUp(e, 1)}
				on:keydown={onKeyDown}
				disabled={verifying} />
		</div>
		<div class="input-container">
			<input
				type="number"
				bind:value={char2}
				bind:this={input2}
				on:keyup={e => onKeyUp(e, 2)}
				on:keydown={onKeyDown}
				disabled={verifying} />
		</div>
		<div class="input-container">
			<input
				type="number"
				bind:value={char3}
				bind:this={input3}
				on:keyup={e => onKeyUp(e, 3)}
				on:keydown={onKeyDown}
				disabled={verifying} />
		</div>
		<div class="space">-</div>
		<div class="input-container">
			<input
				type="number"
				bind:value={char4}
				bind:this={input4}
				on:keyup={e => onKeyUp(e, 4)}
				on:keydown={onKeyDown}
				disabled={verifying} />
		</div>
		<div class="input-container">
			<input
				type="number"
				bind:value={char5}
				bind:this={input5}
				on:keyup={e => onKeyUp(e, 5)}
				on:keydown={onKeyDown}
				disabled={verifying} />
		</div>
		<div class="input-container">
			<input
				type="number"
				bind:value={char6}
				bind:this={input6}
				on:keyup={e => onKeyUp(e, 6)}
				on:keydown={onKeyDown}
				disabled={verifying} />
		</div>
	</div>
	{#if message}
		<div class="message" class:error={didError}>{message}</div>
	{:else}
		<div style="height: 38px" />
	{/if}
	<div class="actions">
		<Button state="app.home">Cancel</Button>
		<span style="float: right">
			<Button simple={false} disabled={didError || !buttonText} state="app.game" params={{ id: gameId || 'null' }}>
				{buttonText || 'Join'}
			</Button>
		</span>
	</div>
</div>
