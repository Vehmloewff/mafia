import polka, { Response } from 'polka';
import fs from 'fs';
import createGame from './api/create-game';
import createGameStore from './game-store';
import joinGame from './api/join-game';
import { createServer } from 'http';
import nodePath from 'path';
import { contentType } from 'mime-types';

const server = createServer();
const app = polka({ server });
const PORT = process.env.PORT || 3000;
const games = createGameStore();

function sendFile(res: Response, file: string) {
	fs.readFile(nodePath.resolve(`public`, file), 'utf-8', (err, data) => {
		if (err) {
			if (err.code === 'ENOENT') {
				// The static file was not found.
				if (/index\.html/.test(file)) {
					// This is index.html.  Throw 404
					res.statusCode = 404;
					res.end(`404 - file not found`);
				} else {
					// This is not the index.html, so that is what we will send
					sendFile(res, `index.html`);
				}
			} else {
				res.statusCode = 500;
				res.end('Internal Server Error');
				console.error(new Date().getDate(), err);
			}
		} else {
			res.setHeader('content-type', contentType(file) || `text/plain`);
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
