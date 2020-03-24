import polka from 'polka';
import fs from 'fs';
const app = polka();
const PORT = process.env.PORT || 3000;
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

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
