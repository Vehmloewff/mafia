import { self, error, messageListener, users, timeLeft, settings, owner } from './store';
import { get } from 'svelte/store';
import { stringify } from 'query-string';
import { User } from '../game/users';
import { setOwner } from './services';
import defaultSettings from '../default-settings';

// @ts-ignore
import { createSnackbar } from './components/snackbar.svelte';
// @ts-ignore
import { createModal } from './components/modal.svelte';

export type Listener = () => void;

export default function createSocket(gameId: string) {
	users.set(new Map());
	settings.set(defaultSettings);

	const $self = get(self);
	const toSend = {
		id: $self.id,
		name: $self.name,
		gender: $self.gender,
	};
	const socket = new WebSocket(
		`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/api/games/${gameId}?${stringify(toSend)}`
	);

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
					destroy: () => socket.close(),
				});

				const message = JSON.parse(data.data);

				// Handle errors
				if (message.key === 'error') {
					console.log(message);

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
					if (!message.params.to)
						return createModal({
							state: 'app.home',
							primaryText: 'Ok',
							preventCancel: true,
							title: `Game closed`,
							message: `${get(users).get(get(owner)).name} has closed this game.`,
						});

					users.update($users => {
						const oldOwner = $users.get(message.params.from);
						oldOwner.isOwner = false;
						$users.set(message.params.from, oldOwner);

						const newOwner = $users.get(message.params.to);
						newOwner.isOwner = true;
						$users.set(message.params.to, newOwner);

						return $users;
					});

					setOwner();

					const $users = get(users);
					const $self = get(self);

					if ($self.id === message.params.to)
						createSnackbar({ text: `${$users.get(message.params.from).name} just made you the game owner` });
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
