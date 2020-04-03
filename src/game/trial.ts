import { MessageHandler } from './message-handler';
import { Users } from './users';
import { Arrest, Settings } from './interfaces';
import { chooseRandArrItem } from '../utils';
import createTimer from './timer';

export default function createTrial(messages: MessageHandler, users: Users, arrest: Arrest, settings: Settings, onDone?: () => void) {
	const unsubscribe: (() => void)[] = [];
	let allowVoting = false;

	// Find out who can vote
	const shouldPickJudge = arrest.isCitizensArrest && settings.incorperateJudges && users.usersOnRole('judge').length;
	const canVote: string[] = !shouldPickJudge
		? users.aliveUsers().filter(id => id !== arrest.arresting) // The person arrested should not be allowed to vote
		: [chooseRandArrItem(users.usersOnRole('judge'))]; // But if the arrested is a judge, he is allowed to vote, after all he is not the mafia

	// Keep a vote tally
	const votes: Map<string, string> = new Map();

	// Tell everyone that we are about to vote
	users.allUsers().forEach(id => {
		messages.send(
			`trial`,
			{
				isCitizensArrest: arrest.isCitizensArrest,
				user: arrest.arresting,
				canVote: canVote.indexOf(id) !== -1,
				accusedBy: arrest.by,
			},
			id
		);
	});

	// Listen for the start-vote message
	const startVote = messages.register(`start-vote`, (_, userId) => {
		const user = users.get(userId);

		// Throw if the user is not the owner
		if (!user.isOwner) return messages.send(`error`, { message: `Only owners can start a vote.`, code: `NOT_OWNER` }, userId);

		// Allow voting
		allowVoting = true;

		// Tell everyone that the vote has started
		messages.broadcast(`started-vote`, null);

		// Start the timer
		createTimer(messages, users, 10, () => onTimerDone());
	});
	unsubscribe.push(startVote);

	// Listen for the votes
	const voteListener = messages.register(`vote`, (selection: string, userId) => {
		votes.set(userId, selection);
		//handleVote(userId, selection, false);
	});
	unsubscribe.push(voteListener);

	function onTimerDone() {
		// Auto select for the clients that did not do so themselves
		users.aliveUsers().forEach(id => {
			// Return if they have already voted
			if (votes.has(id)) return;

			// Auto select
			const selection = autoSelect(id);
			votes.set(id, selection);

			// Tell the client what happend
			messages.send(`vote`, selection, id);
		});

		// Vote ballats
		const innocent: string[] = [];
		const guilty: string[] = [];
		const snorts: string[] = [];

		// Tally the votes
		votes.forEach((selection, userId) => {
			const hideJudge = (userId: string) => (shouldPickJudge && users.get(userId).role === 'judge' ? 'JUDGE' : userId);

			if (canVote.indexOf(userId) === -1) snorts.push(selection);
			else if (selection === 'innocent') innocent.push(hideJudge(userId));
			else if (selection === 'guilty') guilty.push(hideJudge(userId));
			else {
				// And throw if it is invalid
				return messages.send(
					`error`,
					{ message: `Expected a 'innocent' or 'guilty' string.  Got ${selection}`, code: `INVALID` },
					userId
				);
			}
		});

		// Generate a result
		const isGuilty = guilty.length > innocent.length;
		const result = {
			isGuilty,
			guilty,
			innocent,
			snorts,
			role: isGuilty ? users.get(arrest.arresting).role : null,
		};

		// Mark the user as dead if guilty
		const old = users.get(arrest.arresting);
		old.isDead = true;
		if (isGuilty) users.update(old.id, old);

		// unsubscribe
		unsubscribe.forEach(fn => fn());

		// Send the result
		messages.broadcast(`vote-result`, result);

		// Move on
		if (onDone) onDone();
	}

	function autoSelect(id: string): string {
		if (canVote.indexOf(id) !== -1) return 'innocent'; // Always prefer innocent over guilty
		return chooseRandArrItem(settings.snorts);
	}
}
