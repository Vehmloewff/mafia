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

	let citizensArrests: Arrest[] = [];

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
			getCitizensArrests: () => {
				makeSureAllArrestsAreValid();

				return citizensArrests;
			},
		});
	});

	messages.register(`citizens-arrest`, (user: string, id) => {
		const arresting = users.get(user);
		const by = users.get(id);

		console.log(arresting);

		// Make sure that the arrested is alive and well
		if (arresting?.isDead)
			return messages.send(`error`, { message: `The arrested must be alive and well`, code: `ARREST_INVALID` }, id);

		// Make sure that the user has some citizens arrests left
		if (by?.citizensArrestsLeft <= 0)
			return messages.send(`error`, { message: `You don't have any citizens arrests left`, code: `INVALID` }, id);

		// Create the arrest
		citizensArrests.push({ arresting: user, by: id, isCitizensArrest: true, isValid: true });

		// Mark down the users arrestsLeft
		by.citizensArrestsLeft--;
		messages.send(`citizens-arrests-left`, by.citizensArrestsLeft, id);
	});

	messages.register(`get-all-users`, (_, user) => {
		return messages.send(
			`all-users`,
			users.allUsers().map(id => users.getSafe(id, user)),
			user
		);
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

		// Add more citizens arrests if the round number is right
		if (roundNumber % settings.roundsPerCitizensArrest === 0) {
			users
				.aliveUsers()
				.map(id => users.get(id))
				.forEach(user => {
					// Add another arrest
					user.citizensArrestsLeft++;
					users.update(user.id, user);

					// Tell the client that they have more arrests
					messages.send(`citizens-arrests-left`, user.citizensArrestsLeft, user.id);
				});
		}
	}

	function makeSureAllArrestsAreValid() {
		citizensArrests = citizensArrests.map(arrest => {
			if (users.get(arrest.arresting).isDead || users.get(arrest.by).isDead) arrest.isValid = false;

			return arrest;
		});
	}
}
