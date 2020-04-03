import { MessageHandler } from './message-handler';
import { Users } from './users';

export default function(messages: MessageHandler, users: Users) {
	// Get the new and old owners
	const { oldOwner, newOwner } = setNewOwner();

	// Tell everyone what happened
	messages.broadcast(`owner-defer`, { from: oldOwner, to: newOwner });

	function setNewOwner() {
		let currentOwner: string = null;
		let newOwner: string = null;

		users.allUsers().forEach(id => {
			const user = users.get(id);

			if (currentOwner && !user.isDead) {
				newOwner = user.id;

				// Assign a new owner
				user.isOwner = true;
				users.update(user.id, user);

				// Unassign the old owner
				users.update(currentOwner, user => {
					user.isOwner = false;
					return user;
				});
			} else if (user.isOwner) {
				currentOwner = user.id;
			}
		});

		// Make sure someone was assigned
		if (!newOwner) throw new Error('No one was left to assign to be a new owner');

		return {
			oldOwner: currentOwner,
			newOwner,
		};
	}
}
