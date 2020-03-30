import { writable } from 'svelte/store';
import { SafeUser, StartUser, User } from '../game/users';
import { Settings } from '../game/interfaces';
import defaultSnorts from '../game/default-snorts';
import foid from 'foid';

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

// Self - sync it in storage
const fromStorageString = localStorage.getItem('self');
const fromStorage = typeof fromStorageString === 'string' ? JSON.parse(fromStorageString) : { id: foid(20), gender: `Male`, name: `` };
export const self = writable<User>({
	id: fromStorage.id,
	name: fromStorage.name,
	gender: fromStorage.gender,
	isDead: false,
	isOwner: null,
	citizensArrestsLeft: 1,
	role: null,
});
self.subscribe(data => localStorage.setItem(`self`, JSON.stringify({ id: data.id, name: data.name, gender: data.gender })));

export const error = writable<{ message: string; code: string }>(null);
export const roundNumber = writable(0);
export const messageListener = writable((messgageKey: string, params: unknown) => {});
