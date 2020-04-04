import { self, error, messageListener, users, timeLeft } from './store';
import { get } from 'svelte/store';
import { stringify } from 'query-string';
import { User } from '../game/users';
import { setOwner } from './services';

export type Listener = () => void;

export default function createSocket(gameId: string) {
	const $self = get(self);
	const toSend = {
		id: $self.id,
		name: $self.name,
		gender: $self.gender,
	};
	const socket = new WebSocket(`ws://${location.host}/api/games/${gameId}?${stringify(toSend)}`);

	function send(key: string, params: any = null) {
		socket.send(JSON.stringify({ key, params }));
	}

	return new Promise(resolve => {
		socket.onopen = () => {
			const timeout = setTimeout(
				() => error.set({ message: `Did not recieve a message from the server within 5 seconds`, code: `NETWORK` }),
				1000 * 5
			);

			let firstMessage = true;
			socket.onmessage = (data: any) => {
				clearTimeout(timeout);
				resolve({
					send,
				});

				const message = JSON.parse(data.data);

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
				} else if (message.key === 'new-users') {
					users.update($users => {
						message.params.forEach((newUser: User) => {
							$users.set(newUser.id, newUser);
						});
						return $users;
					});

					if (firstMessage) setOwner();
				}

				// Timer
				else if (message.key === 'timer') {
					timeLeft.set(message.params);
				}

				// Owner defer
				else if (message.key === 'owner-defer') {
					const $self = get(self);

					users.update($users => {
						const oldOwner = $users.get(message.params.from);
						oldOwner.isOwner = false;
						$users.set(message.params.from, oldOwner);

						const newOwner = $users.get(message.params.to);
						newOwner.isOwner = true;
						$users.set(message.params.to, newOwner);

						if (message.params.to === $self.id) {
							self.update($self => {
								$self.isOwner = true;
								return $self;
							});
						}

						return $users;
					});
				}

				firstMessage = false;

				// Handle all other messages
				get(messageListener)(message.key, message.params);
			};
		};
		socket.onerror = err => {
			console.error(err);
			resolve();
		};
	});
}
