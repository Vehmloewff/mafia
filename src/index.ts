import polka, { Response } from 'polka';
import fs from 'fs';
import createGame from './api/create-game';
import createGameStore from './game-store';
import joinGame from './api/join-game';
import { createServer } from 'http';
import nodePath from 'path';

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

function sendFile(res: Response, file: string) {
	fs.readFile(nodePath.resolve(`public`, file), 'utf-8', (err, data) => {
		if (err) {
			if (err.code === 'ENOENT') {
				res.statusCode = 404;
				res.end(`404 - File not found`);
			} else {
				res.statusCode = 500;
				res.end('Internal Server Error');
				console.error(new Date().getDate(), err);
			}
		} else {
			res.statusCode = 200;
			res.end(data);
		}
	});
}

app.get('/', (_, res) => {
	sendFile(res, `index.html`);
});

app.get('/:file', (req, res) => {
	sendFile(res, (req as any).params.file);
});

createGame(games, app);
joinGame(games, server);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
