<script context="module">
	import { writable } from 'svelte/store';

	let modal = writable(null);
	let callOnChange = () => {};

	export const createModal = options => {
		callOnChange(options);
	};
</script>

<script>
	import Button from './button.svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { tick } from 'svelte';

	function keyUp(e) {
		if (!$modal) return;
		if ($modal.preventCancel) return;

		if (e.key === `Escape`) {
			const onCancelClick = $modal && $modal.onCancelClick;
			$modal = null;

			if (onCancelClick) onCancelClick();
		}
	}

	let onOkClick;
	let okDisabled;

	let clientHeight;

	callOnChange = options => {
		$modal = null;
		onOkClick = undefined;
		okDisabled = undefined;
		clientHeight = undefined;
		tick().then(() => modal.set(options));
	};
</script>

<style>
	.modal-container {
		position: fixed;
		z-index: 11;
		left: 0;
		right: 0;
	}
	.modal {
		margin: auto;
		max-width: 300px;
		max-height: 90vh;
		color: var(--foreground-more);
		background: var(--midground);
		padding: 16px;
		border-radius: 4px;
		box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
	}

	.component-container {
		max-height: calc(100vh - calc(170px - 68px));
		overflow: auto;
		-webkit-overflow-scrolling: touch;
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
		<div class="modal-container" bind:clientHeight style="top: calc(50vh - calc({clientHeight}px / 2) - 20px)">
			<div class="modal" transition:fly={{ y: -50 }}>
				<h3>{$modal.title}</h3>
				{#if typeof $modal.message === 'string'}
					<p class="text">{$modal.message}</p>
				{:else}
					<div class="component-container">
						<svelte:component this={$modal.message} bind:onOkClick bind:okDisabled />
					</div>
				{/if}
				<div class="footer">
					{#if !$modal.preventCancel}
						<span style="float: left">
							<Button
								on:click={() => {
									if ($modal.onCancelClick) $modal.onCancelClick();
									$modal = null;
								}}>
								Cancel
							</Button>
						</span>
					{/if}
					<Button
						state={$modal.state}
						simple={false}
						disabled={okDisabled}
						on:click={() => {
							if ($modal.onOkClick) $modal.onOkClick();
							if (onOkClick) onOkClick();
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
