import { MessageHandler } from './game/message-handler';
import { random6Digits } from './utils';
import createGame from './game/index';

export type Games = ReturnType<typeof gameStore>;

export default function gameStore() {
	const games: Map<string, MessageHandler['client']> = new Map();

	function create() {
		const id = getRandomId();
		const game = createGame(() => games.delete(id));

		games.set(id, game);

		setTimeout(() => games.delete(id), 1000 * 60 * 60 * 4); // Four hours

		return id;
	}

	function get(id: string) {
		return games.get(id);
	}

	function getRandomId() {
		let id: string = null;

		for (let x = 0; x < 1000; x++) {
			if (!id || games.has(id)) id = random6Digits();
			else break;
		}

		return id;
	}

	return { create, get };
}
