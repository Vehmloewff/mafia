<script context="module">
	import { writable } from 'svelte/store';

	let modal = writable(null);

	export const createModal = options => {
		modal.set(options);
	};
</script>

<script>
	import Button from './button.svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	function keyUp(e) {
		if (!modal) return;

		if (e.key === `Escape`) $modal = null;
		if ($modal.onCancelClick) $modal.onCancelClick();
	}
</script>

<style>
	.modal-container {
		position: fixed;
		top: 30vh;
		z-index: 11;
		left: 0;
		right: 0;
	}
	.modal {
		margin: auto;
		max-width: 300px;
		color: var(--foreground-more);
		background: var(--midground);
		padding: 16px;
		border-radius: 4px;
		box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
	}
	.footer {
		text-align: right;
		margin-top: 10px;
	}
	.background {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 10;
	}
	.blur {
		filter: blur(10px);
		transition: blur 300ms;
	}
</style>

<div on:keyup={keyUp}>
	{#if $modal}
		<div class="background" transition:fade />
		<div class="modal-container">
			<div class="modal" transition:fly={{ y: -50 }}>
				<h3>{$modal.title}</h3>
				<p class="text">{$modal.message}</p>
				<div class="footer">
					<span style="float: left">
						<Button
							on:click={() => {
								if ($modal.onCancelClick) $modal.onCancelClick();
								$modal = null;
							}}>
							Cancel
						</Button>
					</span>
					<Button
						state={$modal.state}
						simple={false}
						on:click={() => {
							if ($modal.onOkClick) $modal.onOkClick();
							$modal = null;
						}}>
						{$modal.primaryText || 'Ok'}
					</Button>
				</div>
			</div>
		</div>
	{/if}
	<div class:blur={$modal}>
		<slot />
	</div>
</div>
