export interface Settings {
	revealAllies: boolean;
	openVote: boolean;
	maxEach: number;
	numberVillagers: number;
	incorperateJudges: boolean;
	maxArrestsPerRound: number;
	roundsPerCitezensArrest: number;
	snorts: string[];
}

export interface Arrest {
	by: string;
	arresting: string;
	isCitizensArrest: boolean;
	isValid: boolean;
}
