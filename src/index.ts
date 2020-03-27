import polka from 'polka';
import fs from 'fs';
import createGame from './api/create-game';
import createGameStore from './game-store';
import joinGame from './api/join-game';
import { createServer } from 'http';

const server = createServer();
const app = polka({ server });
const PORT = process.env.PORT || 3000;
const games = createGameStore();

let filesNames: string[] = [];

fs.readdir(__dirname + '/../public', (err, files) => {
	if (err) console.log(err.message);
	else {
		files.forEach(file => {
			filesNames.push(file);
		});
	}
});

app.get('/:file', (req, res) => {
	let result = (file: string) => {
		let fileName = filesNames.filter(v => v == file);
		fs.readFile(__dirname + '/../public/' + fileName, 'utf-8', (err, data) => {
			if (fileName.length == 0) {
				res.statusCode = 404;
				res.end('404 Not Found');
			} else if (err) {
				console.log(err);
				res.statusCode = 500;
				res.end('Internal Server Error');
			} else {
				res.statusCode = 200;
				res.end(data);
			}
		});
	};
	result((req as any).params.file);
});

createGame(games, app);
joinGame(games, server);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
