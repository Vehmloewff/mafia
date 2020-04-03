import { writable } from 'svelte/store';

export const narrative = writable(``);
export const eliminated = writable([]);
export const snorts = writable([]);
export const trial = writable<any>({});
export const trials = writable([]);
export const voteResult = writable({});
