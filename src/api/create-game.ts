import { Games } from '../game-store';
import { Polka } from 'polka';

export default function(games: Games, app: Polka) {
	app.post(`/api/games`, (req, res) => {
		res.end(games.create());
	});
}
