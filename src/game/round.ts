import { MessageHandler } from './message-handler';
import { Users } from './users';
import { Settings, Arrest } from './interfaces';
import createSelection from './selection';
import { repeat } from '../utils';
import createTrial from './trial';

export interface Hooks {
	onGameOver: () => {};
	onRoundOver: () => {};
	getCitizensArrests: () => Arrest[];
	onCitizensArrestChosen: (index: number) => void;
}

export default function createRound(messages: MessageHandler, users: Users, settings: Settings, hooks: Hooks) {
	const arrests: Arrest[] = [];
	let trials: Arrest[];

	// Ask for a selection
	createSelection(users, messages, {
		onAllSelectionsDone: arrested => {
			// Remember the arrests
			arrested.forEach(id =>
				arrests.push({
					by: `SHERIFF`,
					arresting: id,
					isCitizensArrest: false,
					isValid: true,
				})
			);

			// Move on
			onSelectionDone();
		},
		settings,
	});

	const unsubscribe = messages.register(`next`, () => next());

	function onSelectionDone() {
		trials = getTrials();
	}

	function onTrialDone() {
		trials.shift();
	}

	function next() {
		// End the game if there are any mafias left
		if (!users.usersOnRole('mafia').length) hooks.onGameOver();
		// If there are still trials left, vote on them
		else if (trials.length) createTrial(messages, users, trials[0], settings, () => onTrialDone());
		// Otherwise, the round is over
		else {
			unsubscribe();
			messages.broadcast(`round-over`, null);
		}
	}

	function getTrials() {
		const difference = settings.maxArrestsPerRound - arrests.length;
		const allArrests = Array.from(arrests);

		// Add in some citizens arrests if there is room for them
		if (difference > 0) {
			repeat(difference, () => {
				const citizensArrests = hooks.getCitizensArrests();

				const index = citizensArrests.findIndex(arrest => arrest.isValid);
				if (index === -1) return;

				allArrests.push(citizensArrests[index]);
				hooks.onCitizensArrestChosen(index);
			});
		}

		return allArrests;
	}
}
