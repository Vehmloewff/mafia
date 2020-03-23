import polka from 'polka';
const app = polka();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.end('Hello World!');
});

app.listen(PORT, () => console.log('Listening on port', PORT));
