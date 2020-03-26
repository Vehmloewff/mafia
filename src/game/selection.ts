import { Users, User } from './users';
import { MessageHandler } from './message-handler';
import createTimer from './timer';
import narrator from '../narrator';
import { justHurtLines, justHealedLines, hurtAndHealedLines, reasonsArrested, openers } from '../narrator/lines';
import { Settings } from './interfaces';
import { chooseRandArrItem } from '../utils';

interface Options {
	onAllSelectionsDone?: () => void;
	settings: Settings;
}

export default function createSelection(users: Users, messages: MessageHandler, options: Options) {
	const snorts: string[] = [];
	const hurt: User[] = [];
	const healed: User[] = [];
	const arrested: User[] = [];

	createTimer(messages, users, 10, () => onTimerDone());

	let didNotSelect = users.aliveUsers();

	const unsubscribe = messages.register(`selection`, (selection: string, userId) => {
		writeSelection(userId, selection);
	});

	function onTimerDone() {
		// Loop through all the users that did not select and choose for them
		didNotSelect.forEach(id => {
			const user = users.get(id);

			// Auto select
			const selection = autoSelect(user);
			writeSelection(id, selection);

			// Tell the client what happened
			messages.send(`selection`, selection, id);
		});

		// Define the genders
		const genders: Map<string, 'male' | 'female'> = new Map();
		[...hurt, ...healed, ...arrested].forEach(user => genders.set(user.name, user.gender));

		// Create a narrative
		const story = narrator({
			hurt: hurt.map(user => user.name),
			healed: healed.map(user => user.name),
			arrested: arrested.map(user => user.name),
			characterGenders: genders,
			waysHurt: justHurtLines,
			waysHealed: justHealedLines,
			waysHurtAndHealed: hurtAndHealedLines,
			reasonsArrested: reasonsArrested,
			openers: openers,
		});

		// Find out who was eliminated
		const eliminated = hurt.filter(user => !healed.find(v => v.id === user.id)).map(user => ({ id: user.id, role: user.role }));

		// And mark them as dead
		eliminated.forEach(({ id }) => {
			const user = users.get(id);
			user.isDead = true;

			users.update(id, user);
		});

		// Broadcast the narrative
		messages.broadcast(`narrative`, { story, eliminated, snorts });

		// Remove the current listeners
		unsubscribe();

		// Let others know that this is done
		if (options.onAllSelectionsDone) options.onAllSelectionsDone();
	}

	function writeSelection(userId: string, selection: string, sendErrors: boolean = true) {
		const user = users.get(userId);

		if (!user) return console.warn(`Ignoring invalid user ${userId}.`);

		if (user.role === 'judge' || user.role === 'villager') {
			// Selection should be a snort
			snorts.push(selection);
		} else {
			// Selection should be a user
			const target = users.get(selection);

			// But we'll throw if it's not
			if (!target && sendErrors) return messages.send(`error`, { message: `Selection is not a user.`, code: `NOT_USER` }, userId);

			// Throw if a mafia is selecting a mafia
			if (user.role === 'mafia' && target.role === 'mafia' && sendErrors)
				return messages.send(`error`, { message: `A mafia can't select a mafia`, code: `MAFIA_CIVIL_WAR` }, userId);

			// Remember the selection
			if (user.role === 'mafia') hurt.push(target);
			else if (user.role === 'doctor') healed.push(target);
			else if (user.role === 'sheriff') arrested.push(target);
		}

		// Remove userId from didNotSelect array
		const index = didNotSelect.indexOf(userId);
		didNotSelect.splice(index, 1);
	}

	function autoSelect(user: User): string {
		let choices: string[] = [];

		if (user.role === 'sheriff' || user.role === 'doctor') {
			choices = users.aliveUsers().filter(id => id !== user.id);
		} else if (user.role === 'mafia') {
			choices = users.aliveUsers().filter(id => users.get(id).role !== 'mafia');
		} else {
			choices = options.settings.snorts;
		}

		return chooseRandArrItem(choices);
	}
}
