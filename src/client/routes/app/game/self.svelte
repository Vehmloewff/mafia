<script context="module">
	export const route = {
		name: 'app.game.self',
		route: 'self',
		async resolve(_, paramaters) {
			return {
				id: paramaters.id,
			};
		},
	};
</script>

<script>
	import Button from '../../../components/button.svelte';
	import Page from '../../../components/page.svelte';
	import { fly } from 'svelte/transition';
	import { onMount, tick } from 'svelte';
	import socket from '../../../socket';
	import { stateRouter, self, currentSocket } from '../../../store';
	import foid from 'foid';
	import { gameIsValid } from '../../../verify-game';

	export let id;

	let gender = $self.gender;
	let name = $self.name;

	let didTouchName = false;
	let loading = false;
	$: didError = !name.length;

	let input;

	onMount(async () => {
		await tick();
		input.focus();
	});

	async function submit(e) {
		e.preventDefault();
		didTouchName = true;

		if (didError) return;

		loading = true;

		if (!(await gameIsValid(id))) {
			return $stateRouter.go(`app.invalid-game`, { id });
		}

		self.update(old => {
			old.name = name;
			old.gender = gender;

			return old;
		});

		$currentSocket = await socket(id);
		localStorage.setItem(`game-in-progress`, id);

		$stateRouter.go(`app.game.pre-start`, { id });
	}
</script>

<style>
	.input-container {
		display: inline-block;
		width: calc(100% - 92px);
		text-align: left;
	}
	input {
		margin-left: 15px;
		width: 100%;
	}
	input::placeholder {
		position: relative;
		top: 1px;
		color: var(--placeholders);
	}
	.line {
		width: 350px;
		margin: auto;
		padding: 8px;
		margin-top: 10px;
		position: relative;
		border-bottom: 1px solid var(--midground);
	}
	.line:focus-within {
		border-bottom: 1px solid var(--action);
	}
	.line .label {
		display: inline-block;
		width: 60px;
		text-align: right;
	}
	.line.error {
		border-bottom: 1px solid var(--danger);
	}

	select {
		background: rgba(0, 0, 0, 0);
		outline: none;
		width: calc(100% - 92px);
		color: var(--foreground-more);
		border: none;
		font-size: 16px;
		margin-left: 10px;
	}
	option {
		background: var(--midground);
		border: none;
		outline: none;
	}
	option:hover {
		background: var(--highlight);
	}

	.later {
		text-align: right;
		width: 350px;
		margin: auto;
		padding-top: 40px;
	}
	.required {
		color: var(--danger);
		font-size: 14px;
		position: absolute;
		top: 10px;
		right: 5px;
		font-style: italic;
	}
</style>

<Page>
	<div class="container center">
		<h2 style="padding-top: 20vh">Tell us about yourself</h2>
		<form style="padding-top: 15px;" on:submit={submit}>
			<label>
				<div class="line" class:error={didError}>
					<div class="label">Name:</div>
					<div class="input-container">
						<input type="text" bind:value={name} placeholder="John" bind:this={input} />
						{#if didError}
							<div class="required" transition:fly={{ x: 100 }}>required</div>
						{/if}
					</div>
				</div>
			</label>
			<label>
				<div class="line">
					<div class="label">Gender:</div>
					<div class="input-container">
						<select>
							<option on:click={() => (gender = 'Male')}>Male</option>
							<option on:click={() => (gender = 'Female')}>Female</option>
						</select>
					</div>
				</div>
			</label>

			<div class="later">
				<span style="float: left">
					<Button state="app.home" forceButton={true}>Back</Button>
				</span>
				<Button simple={false} disabled={didError || loading}>Continue</Button>
			</div>
		</form>
	</div>
</Page>
