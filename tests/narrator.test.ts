import { describe } from 'zip-tap';
import narrator from '../src/narrator/index';
import { justHurtLines, justHealedLines, hurtAndHealedLines, reasonsArrested } from '../src/narrator/lines';

describe(`narrator`, it => {
	it(`it should generate a nice story`, expect => {
		console.log(
			narrator({
				hurt: [`Bill`],
				healed: [`Jack`],
				arrested: [`Jill`],
				waysHurt: [justHurtLines[0]],
				waysHealed: [justHealedLines[0]],
				waysHurtAndHealed: [hurtAndHealedLines[0]],
				reasonsArrested: [reasonsArrested[0]],
				characterGenders: new Map([
					[`Bill`, 'male'],
					['Jack', 'male'],
					['Jill', 'female'],
				]),
			})
		);
		console.log(
			`-------\n` +
				narrator({
					hurt: [`Bill`],
					healed: [`Bill`, `Jack`],
					arrested: [`Jill`],
					waysHurt: [justHurtLines[0]],
					waysHealed: [justHealedLines[0]],
					waysHurtAndHealed: [hurtAndHealedLines[0]],
					reasonsArrested: [reasonsArrested[0]],
					characterGenders: new Map([
						[`Bill`, 'male'],
						['Jack', 'male'],
						['Jill', 'female'],
					]),
				})
		);
		console.log(
			`-------\n` +
				narrator({
					hurt: [],
					healed: [`Jack`],
					arrested: [`Jill`],
					waysHurt: [justHurtLines[0]],
					waysHealed: [justHealedLines[0]],
					waysHurtAndHealed: [hurtAndHealedLines[0]],
					reasonsArrested: [reasonsArrested[0]],
					characterGenders: new Map([
						[`Bill`, 'male'],
						['Jack', 'male'],
						['Jill', 'female'],
					]),
				})
		);
		console.log(
			`-------\n` +
				narrator({
					hurt: [],
					healed: [],
					arrested: [`Jill`],
					waysHurt: [justHurtLines[0]],
					waysHealed: [justHealedLines[0]],
					waysHurtAndHealed: [hurtAndHealedLines[0]],
					reasonsArrested: [reasonsArrested[0]],
					characterGenders: new Map([
						[`Bill`, 'male'],
						['Jack', 'male'],
						['Jill', 'female'],
					]),
				})
		);
	});
});
