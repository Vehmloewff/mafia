// @ts-ignore
import { createModal } from './components/modal.svelte';

export const sureExitGame = () => {
	createModal({
		title: `Are you sure you want to exit?`,
		message: `You will not be able to join this game again.`,
		primaryText: `Yes`,
		state: `app.home`,
		onOkClick: () => localStorage.removeItem(`game-in-progress`),
	});
};
