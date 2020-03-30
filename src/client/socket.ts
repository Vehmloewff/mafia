import { self, error, messageListener } from './store';
import { get } from 'svelte/store';
import { stringify } from 'query-string';

export type Listener = () => void;

export default function createSocket(gameId: string) {
	const $self = get(self);
	const socket = new WebSocket(`ws://${location.host}/api/games/${gameId}?${stringify($self)}`);

	function send(key: string, params: any = null) {
		socket.send(JSON.stringify({ key, params }));
	}

	return new Promise(resolve => {
		socket.onopen = () => {
			socket.onmessage = data => {
				const message = JSON.parse((data as any) as string);

				// Handle errors
				if (message.key === 'error') {
					if (message.params.code === 'INVALID_GAME_ID') console.log('invalid game id');
					else error.set(message.params);
				}

				// Listen for user info
				else if (message.key === 'citizens-arrests-left') {
					self.update($self => {
						$self.citizensArrestsLeft = Number(message.params);
						return $self;
					});
				}

				// Handle all other messages
				get(messageListener)(message.key, message.params);
			};

			resolve({
				send,
			});
		};
		socket.onerror = err => {
			console.error(err);
			resolve();
		};
	});
}
