import { self } from './store';
import { get } from 'svelte/store';

export function gameIsValid(id: string) {
	return fetch(`/api/games/${id}`)
		.then(res => res.status === 200)
		.catch(_ => false);
}

export function gameExists(id: string) {
	return fetch(`/api/games/${id}?existsOnly=true`)
		.then(res => res.status === 200)
		.catch(_ => false);
}

export function gameStatus(game: string): Promise<'invalid' | 'ok' | 'started'> {
	const user = get(self).id;

	return fetch(`/api/game-playable?game=${game}&user=${user}`)
		.then(res => res.text())
		.then(text => text as 'invalid' | 'ok' | 'started')
		.catch(err => 'invalid');
}
