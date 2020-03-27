import { MessageHandler } from './message-handler';
import { Users } from './users';

export default function createTimer(messages: MessageHandler, users: Users, time: number, onDone: () => void) {
	let timeLeft = time;
	let isPaused = false;

	const unsubscribe = messages.register(`timer`, (action: string, userId) => {
		// Throw if the user is not the owner
		if (!users.get(userId).isOwner)
			return messages.send(`error`, { message: `Only owners can control the timer.`, code: `NOT_OWNER` }, userId);

		// Perform the action
		if (action === 'pause') isPaused = true;
		else if (action === 'play') {
			isPaused = false;
			onPlay();
		} else {
			// Throw when an invalid action is sent
			messages.send(`error`, { message: `The only valid actions are pause and play.  Recieved: ${action}`, code: `INVALID` }, userId);
		}
	});

	function onPlay() {
		timeLeft--;
		countDown();
	}

	function countDown() {
		if (time >= 0) {
			setTimeout(() => {
				time--;
				messages.broadcast(`timer`, timeLeft);
				next();
			}, 1000);
		} else {
			unsubscribe();
			onDone();
		}
	}

	function next() {
		if (!isPaused) countDown;
	}
}
