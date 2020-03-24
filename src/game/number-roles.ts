export function numberRoles(num: number, options: { maxOfEach: number | null; amountOfVillagers: number; judges: boolean }) {
	const importantRoles = options.judges ? 4 : 3;
	const minimum = (options.maxOfEach ?? 1) * importantRoles + options.amountOfVillagers;

	if (num < minimum) throw new Error(`NOT_ENOUGH`);
	if (options.amountOfVillagers > 3) throw new Error(`INVALID_PARAM`);

	let villagers = Math.floor(num * 0.3 * options.amountOfVillagers);

	function makeGuessForNumberEach() {
		const guess = Math.floor((num - villagers) / importantRoles);
		return guess > 0 ? guess : 1;
	}

	let numberOfEach = options.maxOfEach === null ? makeGuessForNumberEach() : options.maxOfEach;

	function shouldContinue(): boolean {
		if (numberOfEach <= 1) return false;

		const importantPeople = numberOfEach * importantRoles;
		const impliedVillagers = num - importantPeople;

		return impliedVillagers > villagers;
	}

	while (shouldContinue()) numberOfEach--;

	// Reconcile
	villagers = num - numberOfEach * importantRoles;

	return {
		villager: villagers,
		eachRole: numberOfEach,
	};
}
