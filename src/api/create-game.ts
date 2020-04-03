import { Games } from '../game-store';
import { Polka } from 'polka';

export default function(games: Games, app: Polka) {
	app.post(`/api/games`, (req, res) => {
		res.end(games.create());
	});

	app.get('/api/games/:id', (req, res) => {
		const game = games.get(req.params.id);
		const found = !!game && game.playable();

		res.statusCode = found ? 200 : 404;
		res.end(found ? `playable` : `started or invalid`);
	});
}
