import { writable } from 'svelte/store';

export const narrative = writable(``);
export const eliminated = writable([]);
export const snorts = writable([]);
export const trial = writable({});
export const voteResult = writable({});
