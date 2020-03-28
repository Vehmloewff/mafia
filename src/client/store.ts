import { writable } from 'svelte/store';
import { SafeUser, StartUser, User } from '../game/users';
import { Settings } from '../game/interfaces';
import defaultSnorts from '../game/default-snorts';

export const stateRouter = writable(null);
export const router = writable(null);

export const users = writable<SafeUser[]>([]);
export const settings = writable<Settings>({
	revealAllies: true,
	openVote: true,
	maxEach: 2,
	numberVillagers: 1,
	incorperateJudges: true,
	maxArrestsPerRound: 3,
	roundsPerCitizensArrest: 3,
	snorts: Object.keys(defaultSnorts),
});
export const self = writable<User>({
	id: null,
	name: null,
	gender: null,
	isDead: false,
	isOwner: null,
	citizensArrestsLeft: 1,
	role: null,
});
export const error = writable<{ message: string; code: string }>(null);
export const roundNumber = writable(0);
export const messageListener = writable((messgageKey: string, params: unknown) => {});
