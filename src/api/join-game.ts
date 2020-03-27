import { Games } from '../game-store';
import WebSocket from 'ws';
import { Path } from 'path-parser';
import queryString from 'query-string';
import { StartUser } from '../game/users';

export default function(games: Games, server: import('http').Server) {
	const wss = new WebSocket.Server({ server });

	wss.on('connection', (ws, request) => {
		const path = new Path('/api/games/:id');
		const { id } = path.partialTest(request.url);
		const game = games.get(id);
		const user = (queryString.parseUrl(request.url).query as any) as StartUser;

		// Make sure that we have a valid game
		if (!game) {
			ws.send(JSON.stringify({ key: `error`, params: { message: `${id} is an invalid game id.`, code: `INVALID_GAME_ID` } }));
			return ws.close();
		}

		// Make sure that a valid user was sent
		if (!user.name || !user.id || !user.gender) {
			ws.send(
				JSON.stringify({ key: `error`, params: { message: `Did not recieve a valid user in the query params`, code: `INVALID` } })
			);
			return ws.close();
		}

		// Listen for messages
		ws.on('message', (data: string) => {
			game.handleMessage(data, ws);
		});

		// Relay messages
		game.onMessage((message, client) => {
			if (client == ws) client.send(message);
		});

		// Add the client
		game.addClient(ws, user);
	});
}
