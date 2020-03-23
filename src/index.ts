import polka from 'polka';
const app = polka();
const PORT = process.env.PORT || 3000;

app.get('/', (_, res) => {
	res.end('Hello World!');
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
