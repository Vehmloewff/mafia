export function numberRoles(num: number, options: { maxOfEach: number | null; amountOfVillagers: number; judges: boolean }) {
	const importantRoles = options.judges ? 4 : 3;
	const minimum = (options.maxOfEach ?? 1) * importantRoles + options.amountOfVillagers;

	if (Number.isNaN(num)) throw new Error(`Invalid number`);
	if (num < minimum) {
		const err = new Error(`NOT_ENOUGH`);
		(err as any).moreNeeded = minimum - num;
		throw err;
	}
	if (options.amountOfVillagers > 3) throw new Error(`INVALID_PARAM`);

	let villagers = options.amountOfVillagers === 1 ? 1 : Math.floor(num * 0.2 * options.amountOfVillagers);

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
