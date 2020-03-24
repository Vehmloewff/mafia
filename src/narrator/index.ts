import { chooseRandArrItem, getPronoun, makeListString, makeNounPlural, capitalizeSentenceLeads } from '../utils';

export interface NarratorOptions {
	hurt: string[];
	healed: string[];
	arrested: string[];
	characterGenders: Map<string, 'male' | 'female'>;
	waysHurt: string[];
	waysHealed: string[];
	waysHurtAndHealed: string[];
	reasonsArrested: string[];
	openers: string[];
}

interface Roles {
	hurt: string[];
	healed: string[];
	hurtAndHealed: string[];
	arrested: string[];
}

const hurtLinks = [`There was another sad story that took place that night.  Just five minuites later,`];
const healedLinks = [`There was also another doctor wasting his time.  You see,`];
const hurtAndHealedLinks = [`At the exact same time,`];
const arrestedLinks = [`Another Sheriff was following up another lead.  At half past five,`];

export default (options: NarratorOptions) => {
	// Get all the characters
	const characters: string[] = Array.from(options.characterGenders.keys());

	// Assign to each character a role
	const roles: Roles = {
		hurt: [],
		healed: [],
		hurtAndHealed: [],
		arrested: [],
	};
	characters.forEach(character => {
		let isHurt = false;
		let isHealed = false;
		let isHurtAndHealed = false;
		let isArrested = false;

		if (options.hurt.indexOf(character) !== -1) isHurt = true;
		if (options.healed.indexOf(character) !== -1) isHealed = true;
		if (isHurt && isHealed) {
			isHurtAndHealed = true;
			isHurt = false;
			isHealed = false;
		}
		if (options.arrested.indexOf(character) !== -1) isArrested = true;

		if (isHurt) roles.hurt.push(character);
		if (isHealed) roles.healed.push(character);
		if (isHurtAndHealed) roles.hurtAndHealed.push(character);
		if (isArrested) roles.arrested.push(character);
	});

	// Create the sections
	const map = (instances: string[]) => (character: string) =>
		capitalizeSentenceLeads(
			chooseRandArrItem(instances)
				.replace(/\$NAMES/g, makeNounPlural(character))
				.replace(/\$NAME/g, character)
				.replace(/\$HE/g, getPronoun(options.characterGenders.get(character), 'he'))
				.replace(/\$HIM/g, getPronoun(options.characterGenders.get(character), 'him'))
				.replace(/\$HIS/g, getPronoun(options.characterGenders.get(character), 'his'))
		);

	const hurt = roles.hurt.map(map(options.waysHurt)).join(`\n\n${chooseRandArrItem(hurtLinks)} `);
	const healed = roles.healed.map(map(options.waysHealed)).join(`\n\n${chooseRandArrItem(healedLinks)} `);
	const hurtAndHealed = roles.hurtAndHealed.map(map(options.waysHurtAndHealed)).join(`\n\n${chooseRandArrItem(hurtAndHealedLinks)} `);
	const arrested = roles.arrested.map(map(options.reasonsArrested)).join(`\n\n${chooseRandArrItem(arrestedLinks)} `);

	// Generate the story
	let story = ``;

	if (hurt.length || hurtAndHealed.length || healed.length) story += `${chooseRandArrItem(options.openers)}, `;
	if (hurt.length) story += `${hurt}  `;
	if (hurtAndHealed.length) {
		if (hurt.length) story += `\n\nAround the same time, ${hurtAndHealed}  `;
		else story += `${hurtAndHealed}  `;
	}
	if (healed.length) {
		if (hurt.length)
			story += `\n\nThe reason why there was no doctor around to help ${makeListString(roles.hurt)} was because ${healed}  `;
		else if (hurtAndHealed.length) story += `\n\nMeanwhile, ${healed}`;
		else story += healed;
	}
	if (!hurt.length && options.healed.length >= 2) story += `  Wow, the doctors were really on the ball that night.`;
	if (arrested.length)
		story += `\n\n${
			options.hurt.length + options.healed.length >= 5 ? `After that long night was finally over` : `The next morning`
		}, ${arrested}\n\n${makeListString(options.arrested)}, what do you have to say for ${
			options.arrested.length === 1 ? 'yourself' : 'yourselves'
		}?`;

	// Return
	return story;
};
