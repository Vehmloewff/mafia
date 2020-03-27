export const getRandInteger = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min) + min);
};

export const chooseRandArrItem = <T>(arr: T[]): T => {
	return arr[getRandInteger(0, arr.length)];
};

export const repeat = (n: number, cb: (index: number) => void) => {
	for (let index = 0; index < n; index++) {
		cb(index);
	}
};

export const shuffleArray = <T>(arr: T[], n?: number): T[] => {
	const newArr: T[] = [];

	repeat(n || arr.length, () => {
		const randomNumber = getRandInteger(0, arr.length - 1);
		newArr.push(arr[randomNumber]);

		arr.splice(randomNumber, 1);
	});

	return newArr;
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
	if (items.length <= 1) return items.join();

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

const nums = `1234567890`.split('');

export function random6Digits() {
	const getChar = () => nums[Math.floor(Math.random() * nums.length)];

	let chars = ``;
	repeat(6, () => (chars += getChar()));

	return chars;
}
