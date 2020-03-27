import { MessageHandler } from './message-handler';
import { Users } from './users';
import { Settings, Arrest } from './interfaces';
import createRound from './round';

export interface Hooks {
	onGameOver: () => void;
}

export default function createRounds(messages: MessageHandler, users: Users, settings: Settings, hooks: Hooks) {
	let playingRound = false;
	let roundNumber = 0;

	const citizensArrests: Arrest[] = [];

	messages.register(`start-next-round`, (_, id) => {
		const user = users.get(id);

		// Throw if a round is already in progress
		if (playingRound) return messages.send(`error`, { message: `A round is already in progress`, code: `WRONG_TIME` }, id);

		// Throw if the user that sent the message is not a owner
		if (!user.isOwner) return messages.send(`error`, { message: `Only owners can start a round.`, code: `NOT_OWNER` }, id);

		// Start the next round
		playingRound = true;
		roundNumber++;

		// Tell everyone that the round started
		messages.broadcast(`round`, roundNumber);

		// Handle the round
		createRound(messages, users, settings, {
			onCitizensArrestChosen: index => (citizensArrests[index].isValid = false),
			onGameOver: () => onGameOver(),
			onRoundOver: () => onRoundOver(),
			getCitizensArrests: () => citizensArrests,
		});
	});

	function onGameOver() {
		messages.broadcast(
			`game-over`,
			users.allUsers().map(id => users.get(id))
		);

		hooks.onGameOver();
	}

	function onRoundOver() {
		playingRound = false;
	}
}
