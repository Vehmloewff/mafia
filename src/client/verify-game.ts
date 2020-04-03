export function gameIsValid(id: string) {
	return fetch(`/api/games/${id}`)
		.then(res => res.status === 200)
		.catch(_ => false);
}

export function gameExists(id: string) {
	return fetch(`/api/games/${id}?existsOnly=true`)
		.then(res => res.status === 200)
		.catch(_ => false);
}
