export interface StartUser {
	name: string;
	gender: 'male' | 'female';
	id: string;
}

export interface SafeUser extends StartUser {
	isDead: boolean;
}

export interface User extends SafeUser {
	isOwner: boolean;
	role: Role;
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

	function getSafe(id: string): SafeUser {
		const user = get(id);

		return {
			name: user.name,
			id: user.id,
			isDead: user.isDead,
			gender: user.gender,
		};
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

	return { add, get, getSafe, update, allUsers, aliveUsers, usersOnRole, aliveUsersOnRole };
}
