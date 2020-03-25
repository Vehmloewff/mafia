export interface Options {
	onClientAdded: (data: unknown) => string;
}

type Registar = (params: unknown, user: string) => void | unknown;
type ClientMessageListener = (message: any, client: any) => void;

export default function actions(options: Options) {
	const clients: Map<string, any> = new Map();
	const registrations: Map<string, Registar[]> = new Map();
	const clientMessageListeners: ClientMessageListener[] = [];

	function register(key: string, registar: Registar) {
		const old = registrations.get(key) || [];
		old.push(registar);
		registrations.set(key, old);
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

	function broadcast(key: string, data: unknown) {
		Array.from(clients.keys()).forEach(id => {
			send(key, data, id);
		});
	}

	// http side
	function addClient(client: any, data: any) {
		const id = options.onClientAdded(data);
		clients.set(id, client);
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

	function onMessage(handler: ClientMessageListener) {
		clientMessageListeners.push(handler);
	}

	function parseMessage(message: any): { key: string; params: any } {
		try {
			const data = JSON.parse(message);

			if (!data.key || typeof data.key !== 'string' || !data.params) throw ``;

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
		broadcast,
		client: {
			addClient,
			handleMessage,
			onMessage,
		},
	};
}
