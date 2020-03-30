<script context="module">
	export const route = {
		name: `app.game.settings`,
		route: `settings`,
		async resolve(_, params) {
			return params;
		},
	};
</script>

<script>
	import Socket from '../../../components/socket.svelte';
	import Navbar from '../../../components/navbar.svelte';
	import BackButton from '../../../components/back-button.svelte';
	import Page from '../../../components/page.svelte';
	import { settings } from '../../../store';

	$: console.log($settings);

	function setValue(e, key) {
		const value = e.target.selectedOptions[0].value;
		$settings[key] = value;
	}

	export let id;
</script>

<style>
	.input-container {
		display: inline-block;
		width: calc(100% - 205px);
		text-align: left;
	}
	.line {
		width: 550px;
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
		width: 200px;
		text-align: right;
	}

	select {
		background: rgba(0, 0, 0, 0);
		outline: none;
		width: 100%;
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
</style>

<Socket>
	<Navbar left={10} middle={-8}>
		<div slot="left">
			<span class="container">
				<BackButton label="Mafia" state="app.game.pre-start" params={{ id }} />
			</span>
		</div>
		<div slot="middle">
			<span>
				<h2>Settings</h2>
			</span>
		</div>
	</Navbar>

	<Page>
		<div class="nav-spacer" />
		<form style="padding-top: 15px;" on:submit={e => e.preventDefault()}>
			<label>
				<div class="line">
					<div class="label">Reveal Allies:</div>
					<div class="input-container">
						<select on:change={e => setValue(e, 'revealAllies')}>
							<option value={true} selected={$settings.revealAllies}>true</option>
							<option value={false} selected={!$settings.revealAllies}>false</option>
						</select>
					</div>
				</div>
			</label>
			<label>
				<div class="line">
					<div class="label">Open Vote:</div>
					<div class="input-container">
						<select on:change={e => setValue(e, 'openVote')}>
							<option value={true} selected={$settings.openVote}>true</option>
							<option value={false} selected={!$settings.openVote}>false</option>
						</select>
					</div>
				</div>
			</label>
			<label>
				<div class="line">
					<div class="label">Max Important People:</div>
					<div class="input-container">
						<select on:change={e => setValue(e, 'maxEach')}>
							<option value={null} selected={$settings.maxEach === null}>auto</option>
							<option value={1} selected={$settings.maxEach === 1}>1</option>
							<option value={2} selected={$settings.maxEach === 2}>2</option>
							<option value={3} selected={$settings.maxEach === 3}>3</option>
							<option value={4} selected={$settings.maxEach === 4}>4</option>
							<option value={5} selected={$settings.maxEach === 5}>5</option>
							<option value={6} selected={$settings.maxEach === 6}>6</option>
							<option value={7} selected={$settings.maxEach === 7}>7</option>
							<option value={8} selected={$settings.maxEach === 8}>8</option>
							<option value={9} selected={$settings.maxEach === 9}>9</option>
							<option value={10} selected={$settings.maxEach === 10}>10</option>
						</select>
					</div>
				</div>
			</label>
			<label>
				<div class="line">
					<div class="label">Amount of Villagers:</div>
					<div class="input-container">
						<select on:change={e => setValue(e, 'numberVillagers')}>
							<option value={1} selected={$settings.numberVillagers === 1}>less</option>
							<option value={2} selected={$settings.numberVillagers === 2}>average</option>
							<option value={3} selected={$settings.numberVillagers === 3}>more</option>
						</select>
					</div>
				</div>
			</label>
			<label>
				<div class="line">
					<div class="label">Incorperate Judges:</div>
					<div class="input-container">
						<select on:change={e => setValue(e, 'incorperateJudges')}>
							<option value={true} selected={$settings.incorperateJudges}>true</option>
							<option value={false} selected={!$settings.incorperateJudges}>false</option>
						</select>
					</div>
				</div>
			</label>
			<label>
				<div class="line">
					<div class="label">Trials per round:</div>
					<div class="input-container">
						<select on:change={e => setValue(e, 'maxArrestsPerRound')}>
							<option value={1} selected={$settings.maxArrestsPerRound === 1}>1</option>
							<option value={2} selected={$settings.maxArrestsPerRound === 2}>2</option>
							<option value={3} selected={$settings.maxArrestsPerRound === 3}>3</option>
							<option value={4} selected={$settings.maxArrestsPerRound === 4}>4</option>
							<option value={5} selected={$settings.maxArrestsPerRound === 5}>5</option>
							<option value={6} selected={$settings.maxArrestsPerRound === 6}>6</option>
							<option value={7} selected={$settings.maxArrestsPerRound === 7}>7</option>
							<option value={8} selected={$settings.maxArrestsPerRound === 8}>8</option>
							<option value={9} selected={$settings.maxArrestsPerRound === 9}>9</option>
							<option value={10} selected={$settings.maxArrestsPerRound === 10}>10</option>
						</select>
					</div>
				</div>
			</label>
			<label>
				<div class="line">
					<div class="label">Citizen Arrests/Round:</div>
					<div class="input-container">
						<select on:change={e => setValue(e, 'roundsPerCitizensArrest')}>
							<option value={1} selected={$settings.roundsPerCitizensArrest === 1}>1/1</option>
							<option value={2} selected={$settings.roundsPerCitizensArrest === 2}>1/2</option>
							<option value={3} selected={$settings.roundsPerCitizensArrest === 3}>1/3</option>
							<option value={4} selected={$settings.roundsPerCitizensArrest === 4}>1/4</option>
							<option value={5} selected={$settings.roundsPerCitizensArrest === 5}>1/5</option>
							<option value={6} selected={$settings.roundsPerCitizensArrest === 6}>1/6</option>
							<option value={7} selected={$settings.roundsPerCitizensArrest === 7}>1/7</option>
							<option value={8} selected={$settings.roundsPerCitizensArrest === 8}>1/8</option>
							<option value={9} selected={$settings.roundsPerCitizensArrest === 9}>1/9</option>
							<option value={10} selected={$settings.roundsPerCitizensArrest === 10}>1/10</option>
						</select>
					</div>
				</div>
			</label>
		</form>
	</Page>
</Socket>
