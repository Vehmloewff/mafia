export default function gameIsValid(id: string) {
	return fetch(`/api/games/${id}`)
		.then(res => res.status === 200)
		.catch(_ => false);
}
