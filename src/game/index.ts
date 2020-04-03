import { StartUser, Role } from './users';
import messageHandler from './message-handler';
import storeUsers from './users';
import { numberRoles } from './number-roles';
import { shuffleArray } from '../utils';
import defaultSnorts from './default-snorts';
import { Settings } from './interfaces';
import createRounds from './rounds';

export default function createGame(onGameOver: () => void) {
	const messages = messageHandler({ onClientAdded, afterClientAdded });
	const users = storeUsers();

	let gameDidStart = false;
	let owner: string;
	let settings: Settings = {
		revealAllies: true,
		openVote: true,
		maxEach: null,
		numberVillagers: 1,
		incorperateJudges: false,
		maxArrestsPerRound: 3,
		roundsPerCitizensArrest: 3,
		snorts: Object.keys(defaultSnorts),
	};

	function afterClientAdded(id: string, isNew: boolean) {
		const user = users.get(id);

		// Remember the owner
		if (user.isOwner) owner = id;

		if (user) {
			if (isNew) {
				// This is a new user.  Beam it down to the other users
				messages.broadcastExclude(`new-users`, [users.getSafe(id)], id);
			}

			// Tell this user about all the other users
			messages.send(
				`new-users`,
				users.allUsers().map(id => users.getSafe(id)),
				id
			);
		} else {
			// Operation denied
			messages.send(`error`, { message: `The game has already started`, code: `GAME_STARTED` }, id);
		}
	}

	function onClientAdded(data: StartUser) {
		let isNew = true;

		if (!gameDidStart) {
			// Check if this user already exists
			if (users.get(data.id)) {
				// This user exists.
				isNew = false;
			} else {
				// User does not exist.  Add user and proceed as normal
				users.add(data);
			}
		}

		return { id: data.id, shouldCallAfterParams: isNew }; // Tell afterClientAdded if the user is new or old
	}

	// Handle settings changes
	messages.register(`set-settings`, (newSettings: Settings, id: string) => {
		// Throw if the game has already started
		if (gameDidStart)
			return messages.send(
				`error`,
				{ message: `You can't change the settings after the game has started.`, code: `GAME_STARTED` },
				id
			);

		// Also throw if the user is not the owner
		if (!users.get(id).isOwner)
			return messages.send(`error`, { message: `Only owners can change the game settings.`, code: `NOT_OWNER` }, id);

		// Change the settings
		settings = newSettings;
	});

	// Handle calls to start the game
	messages.register(`start-game`, (_, id) => {
		// Throw if the user is not the owner
		if (!users.get(id).isOwner) return messages.send(`error`, { message: `Only owners can start the game.`, code: `NOT_OWNER` }, id);

		// Beam down each players roles
		beamRoles(id);

		// Broadcast the settings
		beamSettings();

		// Remember this
		gameDidStart = true;
		messages.gameStarted();

		// Create the rounds handler
		createRounds(messages, users, settings, {
			onGameOver: () => onGameOver(),
		});
	});

	function beamRoles(sender: string) {
		const allUsers = users.aliveUsers();

		// Get the amount of each role
		let villager: number;
		let eachRole: number;
		try {
			const res = numberRoles(allUsers.length, {
				maxOfEach: settings.maxEach,
				amountOfVillagers: settings.numberVillagers,
				judges: settings.incorperateJudges,
			});

			villager = res.villager;
			eachRole = res.eachRole;
		} catch (e) {
			if (e === `NOT_ENOUGH`) messages.send(`error`, { message: `Not enough users to start a game`, code: e }, sender);
			console.error(e);
		}

		// Create a helper function
		const assign = (amount: number, value: Role) => {
			// Randomly pick out `amount` number of users
			shuffleArray(allUsers, amount).forEach(userId => {
				const user = users.get(userId);

				// Set the role
				user.role = value;
				users.update(userId, user);

				// Tell the client what role they are to play
				messages.send(`role`, value, userId);

				// Remove user from the iteration
				const index = allUsers.indexOf(userId);
				allUsers.splice(index, 1);
			});
		};

		// Assign each user a role
		assign(villager, 'villager');
		(['doctor', 'mafia', 'sheriff'] as Role[]).forEach(role => assign(eachRole, role));
		if (settings.incorperateJudges) assign(eachRole, 'judge');
	}

	function beamSettings() {
		messages.broadcastExclude(`settings`, settings, owner);
	}

	return messages.client;
}
