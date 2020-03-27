import { Games } from '../game-store';
import { Polka } from 'polka';
import { IncomingMessage } from 'http';

export default function(games: Games, app: Polka<IncomingMessage>) {
	app.post(`/api/games`, (req, res) => {
		res.end(games.create());
	});
}
