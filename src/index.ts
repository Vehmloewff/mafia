import polka, { Request, Response } from 'polka';
import fs from 'fs';
import createGame from './api/create-game';
import createGameStore from './game-store';
import joinGame from './api/join-game';
import { createServer } from 'http';
import nodePath from 'path';
import { lookup } from 'mime-types';

const server = createServer();
const app = polka({ server, onNoMatch });
const PORT = process.env.PORT || 3000;
const games = createGameStore();

function sendFile(res: Response, file: string) {
	if (file[0] === '/') file = file.replace('/', '');

	fs.stat(nodePath.resolve(`public`, file), (err, stat) => {
		if (err) {
			if (err.code === 'ENOENT' || err.code === 'EISDIR') {
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
			res.statusCode = 200;
			let type = lookup(file) as string;
			let charset = /^text\/|^application\/(javascript|json)/.test(type || 'text/plain') ? 'UTF-8' : false;
			res.setHeader('Last-Modified', new Date(stat.mtimeMs).toUTCString());
			res.setHeader('Content-Length', stat.size);
			res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
			fs.createReadStream(nodePath.resolve(`public`, file)).pipe(res);
		}
	});
}

app.get('/', (_, res) => {
	sendFile(res, `index.html`);
});

function onNoMatch(req: Request, res: Response) {
	if (req.url.startsWith('/api')) {
		res.statusCode = 404;
		res.end(`404 - not found`);
	} else sendFile(res, req.url);
}

createGame(games, app);
joinGame(games, server);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
