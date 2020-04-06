<script>
	import { self } from '../store';
	import pencil from '../icons/pencil.svg';
	import Icon from './icon.svelte';

	export let min = false;

	function nameSafe(str) {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/ /g, '&nbsp;');
	}
</script>

<style>
	.over {
		position: relative;
		height: 150px;
	}
	.background {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: url('mafia.png');
		background-position: center;
		background-repeat: no-repeat;
		filter: blur(5px) opacity(0.3);
	}

	.name,
	.gender {
		position: absolute;
	}

	.name {
		top: 50px;
		left: 20px;
		right: 20px;
		font-size: 30px;
		color: var(--foreground-more);
		text-align: center;
		text-overflow: ellipsis;
	}
	.gender {
		top: 100px;
		left: 20px;
		right: 20px;
		font-size: 18px;
		text-align: center;
		color: var(--foreground);
	}
</style>

<div class="over">
	<div class="background" />
	<div class="name" class:min>
		{@html nameSafe($self.name)}
	</div>
	<div class="gender" class:min>{$self.gender}</div>
</div>
