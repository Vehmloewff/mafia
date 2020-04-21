export interface NarratorOptions {
	hurt: User[];
	healed: User[];
	arrested: User[];
	waysHurt: string[];
	waysHealed: string[];
	waysHurtAndHealed: string[];
	reasonsArrested: string[];
	openers: string[];
}


export interface User {
    name: string;
    gender: 'male' | 'female';
    role: 'mafia' | 'doctor' | 'sheriff' | 'villager' | null;
    dead: true | false;
}

export interface Story {
    story: string;
    hurt:
}
