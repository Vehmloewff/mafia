import { writable, get } from 'svelte/store';
import { User } from '../game/users';
import { Settings } from '../game/interfaces';
import foid from 'foid';
import defaultSettings from '../default-settings';

export const stateRouter = writable(null);
export const router = writable(null);

export const currentSocket = writable(null);

export const users = writable<Map<string, User>>(new Map());

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
export const messageListener = writable((messgageKey: string, params: unknown) => {});
export const owner = writable<string>(null);
export const timeLeft = writable(0);

export const settings = writable<Settings>(defaultSettings);

settings.subscribe($settings => {
	const socket = get(currentSocket);
	const $self = get(self);
	if (socket && $self.isOwner) socket.send(`set-settings`, $settings);
});
