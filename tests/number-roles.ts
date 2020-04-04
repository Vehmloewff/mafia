import { describe } from 'zip-tap';
import { numberRoles } from '../src/game/number-roles';

describe(`narrator`, it => {
	it(`should number the roles`, expect => {
		expect(numberRoles(5, { maxOfEach: 1, amountOfVillagers: 1, judges: false })).toMatchObject({
			villager: 2,
			eachRole: 1,
		});
	});
	it(`should number the roles when there is no max`, expect => {
		expect(numberRoles(5, { maxOfEach: null, amountOfVillagers: 1, judges: false })).toMatchObject({
			villager: 2,
			eachRole: 1,
		});
		expect(numberRoles(7, { maxOfEach: null, amountOfVillagers: 1, judges: false })).toMatchObject({
			villager: 1,
			eachRole: 2,
		});
	});
});
