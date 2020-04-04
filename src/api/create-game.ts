import { Games } from '../game-store';
import { Polka } from 'polka';

export default function(games: Games, app: Polka) {
	app.post(`/api/games`, (req, res) => {
		res.end(games.create());
	});

	app.get('/api/game-playable', (req, res) => {
		if (!req.query) {
			res.statusCode = 400;
			return res.end('invalid');
		}

		const user = req.query.user as string;
		const id = req.query.game as string;

		if (!id) {
			res.statusCode = 400;
			return res.end('invalid');
		}

		const game = games.get(id);

		if (!game) return res.end('invalid');
		else return res.end(game.playable(user));
	});
}
