import { MessageHandler } from './message-handler';
import { Users } from './users';
import { Arrest, Settings } from './interfaces';
import { chooseRandArrItem } from '../utils';
import createTimer from './timer';

export default function createTrial(messages: MessageHandler, users: Users, arrest: Arrest, settings: Settings) {
	const unsubscribe: (() => void)[] = [];
	let allowVoting = false;

	// Find out who can vote
	const shouldPickJudge = arrest.isCitizensArrest && settings.incorperateJudges && users.usersOnRole('judge').length;
	const canVote: string[] = !shouldPickJudge
		? users.aliveUsers().filter(id => id !== arrest.arresting) // The person arrested should not be allowed to vote
		: [chooseRandArrItem(users.usersOnRole('judge'))]; // But if the arrested is a judge, he is allowed to vote, after all he is not the mafia

	// Keep track of who has not voted
	const didNotVote = Array.from(canVote);

	// And what they voted for
	const innocent: string[] = [];
	const guilty: string[] = [];
	const snorts: string[] = [];

	// Tell everyone that we are about to vote
	users.aliveUsers().forEach(id => {
		messages.send(`trial`, { isCitezensArrest: arrest.isCitizensArrest, user: arrest.by, canVote: canVote.indexOf(id) !== -1 }, id);
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
	const voteListener = messages.register(`vote`, (selection: string, userId) => handleVote(userId, selection, false));
	unsubscribe.push(voteListener);

	function handleVote(userId: string, selection: string, automated: boolean) {
		// Throw if a vote is not in progress
		if (!automated && !allowVoting)
			messages.send(`error`, { message: `Voting is not allowed at this time`, code: `WRONG_TIME` }, userId);

		// Remember the vote
		const hideJudge = (userId: string) => (shouldPickJudge && users.get(userId).role === 'judge' ? 'JUDGE' : userId);

		if (didNotVote.indexOf(userId) === -1) snorts.push(selection);
		else if (selection === 'innocent') innocent.push(hideJudge(userId));
		else if (selection === 'guilty') guilty.push(hideJudge(userId));
		else {
			// And throw if it is invalid
			return automated
				? undefined
				: messages.send(
						`error`,
						{ message: `Expected a 'innocent' or 'guilty' string.  Got ${selection}`, code: `INVALID` },
						userId
				  );
		}

		// Mark that user as voted
		const index = didNotVote.indexOf(userId);
		if (index !== -1) didNotVote.splice(index, 1);
	}

	function onTimerDone() {
		// Auto select for the clients that did not do so themselves
		didNotVote.forEach(id => {
			const selection = autoSelect(id);

			// Tell the client what happend
			messages.send(`vote`, selection, id);

			// Tally the vote
			handleVote(id, selection, true);
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
	}

	function autoSelect(id: string): string {
		if (canVote.indexOf(id)) return 'innocent'; // Always prefer innocent over guilty
		return chooseRandArrItem(settings.snorts);
	}
}
