export interface Options {
	onClientAdded: (data: unknown) => { id: string; shouldCallAfterParams?: boolean };
	afterClientAdded?: (id: string, params: any) => void;
}

type Registar = (params: unknown, user: string) => void | unknown;
type ClientMessageListener = (message: any, client: any) => void;

export type MessageHandler = ReturnType<typeof messageHandler>;

export default function messageHandler(options: Options) {
	const clients: Map<string, any> = new Map();
	const registrations: Map<string, Registar[]> = new Map();
	const clientMessageListeners: ClientMessageListener[] = [];

	let gameDidStart = false;

	function register(key: string, registar: Registar) {
		const old = registrations.get(key) || [];
		old.push(registar);
		registrations.set(key, old);

		return () => {
			const old = registrations.get(key);
			const index = old.indexOf(registar);

			if (index === -1) throw new Error(`It looks the the indexes got mixed up somehow`);

			old.splice(index, 1);

			registrations.set(key, old);
		};
	}

	function send(key: string, data: unknown, clientId: string) {
		const client = clients.get(clientId);
		if (!client) throw new Error(`Client does not exist`);

		clientMessageListeners.forEach(fn =>
			fn(
				JSON.stringify({
					key,
					params: data,
				}),
				client
			)
		);
	}

	function gameStarted() {
		gameDidStart = true;
	}

	function broadcast(key: string, data: unknown) {
		Array.from(clients.keys()).forEach(id => {
			send(key, data, id);
		});
	}

	function broadcastExclude(key: string, data: unknown, idToExclude: string) {
		Array.from(clients.keys()).forEach(id => {
			if (id !== idToExclude) send(key, data, id);
		});
	}

	// http side
	function addClient(client: any, data: any) {
		const { id, shouldCallAfterParams } = options.onClientAdded(data);
		clients.set(id, client);

		if (options.afterClientAdded) options.afterClientAdded(id, shouldCallAfterParams);
	}

	function handleMessage(message: any, client: any) {
		const clientId = getIdForClient(client);
		const { key, params } = parseMessage(message);

		const toCall = registrations.get(key);
		if (!toCall) return;

		toCall.forEach(fn => {
			const res = fn(params, clientId);

			if (res) send(key, res, clientId);
		});
	}

	function playable(clientId: string): 'ok' | 'invalid' | 'started' {
		if (gameDidStart) {
			return clients.get(clientId) ? 'started' : 'invalid';
		} else {
			return 'ok';
		}
	}

	function onMessage(handler: ClientMessageListener) {
		clientMessageListeners.push(handler);
	}

	function parseMessage(message: any): { key: string; params: any } {
		try {
			const data = typeof message === 'string' ? JSON.parse(message) : message;

			if (!data.key || typeof data.key !== 'string') throw ``;

			return data;
		} catch (_) {
			console.warn('Ignoring invalid message', message);
			return { key: ``, params: {} };
		}
	}

	function getIdForClient(client: any): string {
		let id: string = null;

		clients.forEach((possibleMatch, key) => {
			if (possibleMatch === client) id = key;
		});

		return id;
	}

	return {
		register,
		send,
		gameStarted,
		broadcast,
		broadcastExclude,
		client: {
			addClient,
			handleMessage,
			onMessage,
			playable,
		},
	};
}
