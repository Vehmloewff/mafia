import defaultSnorts from './default-snorts';

export default {
	revealAllies: true,
	openVote: true,
	maxEach: null,
	numberVillagers: 1,
	incorperateJudges: false,
	maxArrestsPerRound: 3,
	roundsPerCitizensArrest: 3,
	snorts: Object.keys(defaultSnorts),
};
