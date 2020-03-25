export interface StartUser {
	name: string;
	gender: 'male' | 'female';
	id: string;
}

export interface User extends StartUser {
	isOwner: boolean;
	role: Role;
	isDead: boolean;
	citizensArrestsLeft: number;
}

type Role = 'mafia' | 'doctor' | 'sheriff' | 'judge' | 'villager';

export default function users() {
	const users: Map<string, User> = new Map();

	let isFirstAddition = true;

	function add(user: StartUser) {
		users.set(user.id, {
			name: user.name,
			gender: user.gender,
			id: user.id,
			isOwner: isFirstAddition,
			role: null,
			isDead: false,
			citizensArrestsLeft: 1,
		});

		isFirstAddition = false;
	}

	function get(id: string): User {
		return users.get(id);
	}

	function update(id: string, value: User) {
		users.set(id, value);
	}

	function allUsers(): string[] {
		return Array.from(users.values()).map(user => user.id);
	}

	function aliveUsers(): string[] {
		return Array.from(users.values())
			.filter(user => !user.isDead)
			.map(user => user.id);
	}

	function usersOnRole(role: Role): string[] {
		return Array.from(users.values())
			.filter(user => user.role === role)
			.map(user => user.id);
	}

	function aliveUsersOnRole(role: Role): string[] {
		return Array.from(users.values())
			.filter(user => user.role === role)
			.filter(user => !user.isDead)
			.map(user => user.id);
	}

	return { add, get, update, allUsers, aliveUsers, usersOnRole, aliveUsersOnRole };
}
