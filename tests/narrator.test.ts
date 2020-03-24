import { describe } from 'zip-tap';
import narrator from '../src/narrator/index';
import { justHurtLines, justHealedLines, hurtAndHealedLines, reasonsArrested, openers } from '../src/narrator/lines';

describe(`narrator`, it => {
	const defaults = {
		waysHurt: [justHurtLines[0]],
		waysHealed: [justHealedLines[0]],
		waysHurtAndHealed: [hurtAndHealedLines[0]],
		reasonsArrested: [reasonsArrested[0]],
		openers: [openers[0]],
	};

	// it(`it should generate a nice story`, expect => {
	// 	console.log(
	// 		narrator({
	// 			hurt: [`Bill`],
	// 			healed: [`Jack`],
	// 			arrested: [`Jill`],
	// 			...defaults,
	// 			characterGenders: new Map([
	// 				[`Bill`, 'male'],
	// 				['Jack', 'male'],
	// 				['Jill', 'female'],
	// 			]),
	// 		})
	// 	);
	// 	console.log(
	// 		`-------\n` +
	// 			narrator({
	// 				hurt: [`Bill`],
	// 				healed: [`Bill`, `Jack`],
	// 				arrested: [`Jill`],
	// 				...defaults,
	// 				characterGenders: new Map([
	// 					[`Bill`, 'male'],
	// 					['Jack', 'male'],
	// 					['Jill', 'female'],
	// 				]),
	// 			})
	// 	);
	// 	console.log(
	// 		`-------\n` +
	// 			narrator({
	// 				hurt: [],
	// 				healed: [`Jack`],
	// 				arrested: [`Jill`],
	// 				...defaults,
	// 				characterGenders: new Map([
	// 					['Jack', 'male'],
	// 					['Jill', 'female'],
	// 				]),
	// 			})
	// 	);
	// 	console.log(
	// 		`-------\n` +
	// 			narrator({
	// 				hurt: [],
	// 				healed: [],
	// 				arrested: [`Jill`],
	// 				...defaults,
	// 				characterGenders: new Map([['Jill', 'female']]),
	// 			})
	// 	);
	// });

	it(`should generate a nice story with many roles`, expect => {
		console.log(
			`-------\n` +
				narrator({
					hurt: [`Jack`, `Joe`, `Grace`, `Bud`],
					healed: [`Grace`, `Margot`, `Claire`, `Bud`],
					arrested: [`Justin`, `James`],
					...defaults,
					characterGenders: new Map([
						['Jack', 'male'],
						['Joe', 'male'],
						['Grace', 'female'],
						['Bud', 'male'],
						['Margot', 'female'],
						['Claire', 'female'],
						['Justin', 'male'],
						['James', 'male'],
					]),
				})
		);
	});
});
