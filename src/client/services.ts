// @ts-ignore
import { createModal } from './components/modal.svelte';
// @ts-ignore
import { createSnackbar } from './components/snackbar.svelte';
import { self, users, error, owner, settings, stateRouter, currentSocket } from './store';
import { get } from 'svelte/store';
import { User } from '../game/users';
import { numberRoles } from '../game/number-roles';
import { Settings } from '../game/interfaces';
import { trial, trials } from './routes/app/game/round/store';
import OwnerDefer from './components/owner-defer.svelte';

export const setOwner = () => {
	const $users = get(users);
	const $self = get(self);

	const ownUser = $users.get($self.id);
	if (!ownUser) return error.set({ message: `Self not found!`, code: `INTERNAL` });

	self.update($self => {
		$self.isDead = ownUser.isDead;
		$self.citizensArrestsLeft = ownUser.citizensArrestsLeft;
		$self.isOwner = ownUser.isOwner;
		$self.role = ownUser.role;

		return $self;
	});

	const ownerUser = Array.from($users.values()).find((v: User) => v.isOwner) as User;
	if (!ownUser) return error.set({ message: `Owner not found`, code: `INTERNAL` });

	owner.set(ownerUser.id);
};

export const playersNeeded = () => {
	const $users = get(users);
	const $settings: Settings = get(settings);

	try {
		numberRoles($users.size, {
			maxOfEach: $settings.maxEach,
			amountOfVillagers: $settings.numberVillagers,
			judges: $settings.incorperateJudges,
		});
		return 0;
	} catch (e) {
		if (e.moreNeeded) return e.moreNeeded;
		else throw e;
	}
};

export function makeIdReadable(id: string): string {
	return id.slice(0, 3) + `-` + id.slice(3, 6);
}

export const nextListener = (id: string, round: string) => (key: string, message: any) => {
	const $stateRouter = get(stateRouter);
	const $self = get(self);

	if (key === 'trial') {
		if ($self.isDead) {
			$stateRouter.go('app.game.rip', { id });
		} else {
			trial.set(message);
			trials.update($trials => {
				$trials.push(message);
				return $trials;
			});
			$stateRouter.go('app.game.round.vote', { id, round });
		}
	} else if (key === 'round-over') {
		if ($self.isDead) {
			$stateRouter.go('app.game.rip', { id });
		} else {
			$stateRouter.go('app.game.round.recap', { id, round });
		}
	} else if (key === 'game-over') {
		message.forEach((user: User) => {
			users.update($users => {
				$users.set(user.id, user);
				return $users;
			});
		});
		$stateRouter.go('app.game.game-end', { id });
	}
};

export const callNext = () => {
	const $currentSocket = get(currentSocket);
	const $self = get(self);

	if ($self.isOwner && $self.isDead)
		createModal({
			title: `Defer your ownership`,
			message: OwnerDefer,
			preventCancel: true,
			onOkClick: () => next(),
		});
	else next();

	function next() {
		$currentSocket.send('next');
	}
};

export const exitGame = (isOver = false) => {
	setOwner();

	const $self = get(self);
	const $stateRouter = get(stateRouter);

	defer();

	function defer() {
		if (isOver === true) next();
		else if ($self.isOwner) {
			setTimeout(() => {
				createModal({
					title: `Defer your ownership`,
					message: OwnerDefer,
					onOkClick: () => next(),
				});
			}, 300);
		} else next();
	}

	function next() {
		const gameInProgress = localStorage.getItem('game-in-progress');
		localStorage.removeItem('game-in-progress');
		$stateRouter.go('app.home');

		createSnackbar({
			text: `Exited game`,
			buttonText: `REJOIN`,
			onButtonClick: () => {
				$stateRouter.go('app.game', { id: gameInProgress });
			},
		});
	}
};

export const closeGame = () => {
	const $currentSocket = get(currentSocket);

	createModal({
		title: `Really close this game?`,
		message: `This will delete the game and kick of all current players`,
		onOkClick: () => {
			localStorage.removeItem('game-in-progress');
			$currentSocket.send(`owner-defer`);
		},
		state: `app.home`,
	});
};
