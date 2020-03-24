export const getRandInteger = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min) + min);
};

export const chooseRandArrItem = <T>(arr: T[]): T => {
	return arr[getRandInteger(0, arr.length)];
};

const pronounMap = {
	he: 'she',
	him: 'her',
	his: 'her',
};
export const getPronoun = (gender: 'male' | 'female', instance: 'he' | 'him' | 'his'): string => {
	if (gender === 'male') return instance;
	else return pronounMap[instance];
};

export const makeNounPlural = (noun: string): string => {
	return `${noun}'s`;
};

export const makeListString = (items: string[]): string => {
	const newItems = Array.from(items);
	const last = newItems.pop();
	return `${newItems.join(', ')}${newItems.length < 2 ? '' : ','} and ${last}`;
};

export const capitalizeSentenceLeads = (lines: string): string => {
	let newSentence = ``;

	const lastChar = () => newSentence.trim()[newSentence.trim().length - 1];

	lines.split('').forEach(char => {
		if (lastChar() === `.`) newSentence += char.toUpperCase();
		else newSentence += char;
	});

	return newSentence;
};
