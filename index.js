// pad(n: int, width: int, z: int
// n: number we are padding
// width: maximum width we are padding to
// z: character we are padding with 
function pad(n, width, z = 0) {
	// Convert input number to a string
	n = n + '';

	// Return the padded number as a string
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


// Given a type coverage object, returns
// the summary of all of the numbers which
// is used to mathematically weight the 
// 'strength' of the type coverage.
function getCoverageValue(coverage) {

	// Starting value of 0 (neutral)
	let total = 0;

	// Loop over all of the types
	for (let type of Object.keys(coverage)) {

		// Add the type to the total
		// This will take away for weaknesses,
		// and add for resistances :)
		total += coverage[type];
	}

	// Return the generated total
	return total;
}

// Given a tera type value and the coverage
// of the current type, calculates the strength
// of the given type as coverage for the tera
// type.
function getTeraStrength(type, coverage, ability = 'None') {

	// Strength Value:
	// 4x Weakness -> Immune: 4 Points
	// 4x Weakness -> Resist: 3 Points
	// 4x Weakness -> Neutral: 2 Points
	// 4x Weakness -> 2x Weakness: 1 Point

	// 2x Weakness -> Immune: 3 Points
	// 2x Weakness -> Resist: 2 Points
	// 2x Weakness -> Neutral: 1 Point

	// Neutral -> Immune: 3 Points
	// Neutral -> Resist: 1 Points
	// Neutral -> Neutral: 0 Points
	// Neutral -> Weak: -1 Points

	// Tera Type Strength
	strength = {

		// Resistances gained / lost
		resistancesGained: [],
		resistancesShared: [],

		// Weaknesses gained / lost
		weaknessesGained: [],
		weaknessesShared: [],

		// Calculated as above
		totalStrength: 0
	}

	// Get the type coverage for the given type
	let teraCoverage = getTypeCoverage(type, ability);

	// Loop over the keys
	for (let subtype of Object.keys(Types)) {

		// Neutral
		if (coverage[subtype] == 0) {
			// If tera type resists, increment resists gained
			if (teraCoverage[subtype] < 0) {
				strength.weaknessesGained.push(subtype); // ++;
			}

			// If tera type resists, increment resists gained
			if (teraCoverage[subtype] > 0) {
				strength.resistancesGained.push(subtype); // ++;
			}

			// Add the tera strength for the new type
			strength.totalStrength += teraCoverage[subtype];
		}
		// Weakness
		else if (coverage[subtype] < 0) {
			// If tera type resists, increment resists gained
			if (teraCoverage[subtype] > 0) {
				strength.resistancesGained.push(subtype); // ++;
			}

			// If the tera type is also weak, increment weaknesses shared
			if (teraCoverage[subtype] < 0) {
				strength.weaknessesShared.push(subtype); // ++;
			}

			// Calculate the 'strength' value for the given type
			strength.totalStrength += (teraCoverage[subtype] + Math.abs(coverage[subtype]));
		}
		else // Resistance / immunity
		{
			// If tera type resists, increment resists gained
			if (teraCoverage[subtype] < 0) {
				strength.weaknessesGained.push(subtype); // ++;
			}

			// If the tera type is also weak, increment weaknesses shared
			if (teraCoverage[subtype] > 0) {
				strength.resistancesShared.push(subtype); // ++;
			}
		}
	}

	// Return the calculated strength
	return strength;
}

// Given two pre-calculated types, calculate
// the weakesses and resistances of the 
// combined types.
function getCombinedCoverage(a, b) {

	// Combined type coverage
	let combined = {};

	// Loop over the keys
	for (let type of Object.keys(Types)) {

		// If either of the types are immune
		if (a[type] === TypeEff.immune || b[type] === TypeEff.immune) {

			// The combination is immune
			combined[type] = TypeEff.immune;
		}
		else // Neither type is immune
		{
			// Add the coverage together
			combined[type] = a[type] + b[type];
		}
	}

	// Return the combined coverage
	return combined;
}

// Apply the ability to the coverage :)
function applyAbility(coverage, ability) {

	// Switch on the ability
	switch (ability) {

		// New Abilities

		case 'BakedBody':
			// Immune to fire
			coverage['fire'] = 3;
			break;

		case 'EarthEater':
			// Immune to ground
			coverage['ground'] = 3;
			break;

		case 'PurifyingSalt':
			// Resistant to ghost
			coverage['ghost']++;
			break;

		// Weak / Resist Abilities

		case 'Heatproof':
			// Resistant to fire
			coverage['fire']++;
			break;

		case 'ThickFat':
			// Resistant to fire
			coverage['fire']++;

			// Resistant to ice
			coverage['ice']++;
			break;

		case 'Fluffy':
			// Weak to fire
			coverage['fire']--;
			break;

		// Immunity Abilities

		// Dry Skin
		case 'DrySkin':
			// Immune to Water
			coverage['Water'] = 3;

			// Weaker to Fire
			coverage['Fire']--;
			break;

		// Flash Fire
		case 'FlashFire':
			// Immune to Fire
			coverage['Fire'] = 3;
			break;

		// Levitate
		case 'Levitate':
			// Immune to Ground
			coverage['Ground'] = 3;
			break;

		// Lightning Rod
		case 'LightningRod':
			// Immune to Electric
			coverage['Electric'] = 3;
			break;

		// Sap Sipper
		case 'SapSipper':
			// Immune to Grass
			coverage['Grass'] = 3;
			break;

		// Storm Drain
		case 'StormDrain':
			// Immune to Water
			coverage['Water'] = 3;
			break;

		// Volt Absorb
		case 'VoltAbsorb':
			// Immune to Electric
			coverage['Electric'] = 3;
			break;

		// Water Absorb
		case 'WaterAbsorb':
			// Immune to Water
			coverage['Water'] = 3;
			break;
	}

	// Return the coverage
	return coverage;
}

function getTypeCoverage(type, ability = 'None') {

	// Total Type Coverage
	let typeCoverage = {

	};

	// Get the coverage for the given type
	coverage = Types[type].damageTaken;

	// Loop over all of the subtypes
	for (let subType of Object.keys(Types)) {

		// Get the type effectiveness of the subtype
		let typeEff = coverage[subType];

		switch (typeEff) {
			case 3: // Immune
				typeCoverage[subType] = TypeEff.immune;
				break;
			case 2: // Resist
				typeCoverage[subType] = TypeEff.resist;
				break;
			case 1: // Weak
				typeCoverage[subType] = TypeEff.weak;
				break;
			default: // Neutral
				typeCoverage[subType] = TypeEff.neutral;
				break;
		}
	}

	// Return the type coverage
	return applyAbility(typeCoverage, ability);
}

// getCoverage(): void
function getCoverage() {

	// Get the ability from the page
	let ability = document.getElementById('sel-ability').value;

	// Pokemon Types
	let types = {
		// Primary Type (Required)
		primary: document.getElementById("sel-type-primary").value,

		// Secondary Type (Optional)
		secondary: document.getElementById("sel-type-secondary").value
	}

	// Get the coverage for the primary type
	let coverage = getTypeCoverage(types.primary, ability);

	// If a secondary type is specified
	if (types.secondary !== 'None') {

		// Get the details for the secondary type
		let secondary = getTypeCoverage(types.secondary);

		// Get the combined type coverage
		coverage = getCombinedCoverage(coverage, secondary);
	}

	// Get the results table
	let results = document.getElementById('body-results');

	// Wipe the contents of the results table.
	results.innerHTML = "";

	// Tera Coverage Array
	let teraCoverage = [];

	// Loop over all of the types
	for (let type of Object.keys(Types)) {

		// Calculate the tera type strength for the type
		let strength = getTeraStrength(type, coverage, ability, false);

		// Add the type with the strength to the list
		teraCoverage.push({
			type: type,
			strength: strength
		});
	}

	// Sort the array, using the coverage value as the heuristic (highest first)
	teraCoverage.sort(function (a, b) {
		// Higher values appear at the top
		return a.strength.totalStrength < b.strength.totalStrength
	});

	// Type Rankings
	let rank = 1;

	// Loop over the objects (in order)
	for (let type of teraCoverage) {

		// Get the progress colour (for the rank)
		let style = getColorStyle(getProgressColor(1 - (rank / teraCoverage.length)));

		results.innerHTML +=
			"<tr>" +
			"<th style='" + style + "'>" + rank + "</th>" +
			"<td><img src='img/type/sm/" + type.type + ".png'></img></td>" +
			"<td>" +
			type.strength.totalStrength +
			"</td>" + // Strength
			"<td class='hovertext' data-hover='" +
			(type.strength.resistancesGained.join(", ") || 'None') + "'>" +
			type.strength.resistancesGained.length +
			"</td>" + // Resistances Gained
			"<td class='hovertext' data-hover='" +
			(type.strength.resistancesShared.join(", ") || 'None') + "'>" +
			type.strength.resistancesShared.length +
			"</td>" + // Resistances Shared
			"<td class='hovertext' data-hover='" +
			(type.strength.weaknessesGained.join(", ") || 'None') + "'>" +
			type.strength.weaknessesGained.length +
			"</td>" + // Weaknesses Gained
			"<td  class='hovertext' data-hover='" +
			(type.strength.weaknessesShared.join(", ") || 'None') + "'>" +
			type.strength.weaknessesShared.length +
			"</td>" + // Weaknesses Shared
			"</tr>";

		// Increment the rank
		rank++;
	}
}

// Get the page icon
getIcon();

// Get the default coverage on startup
getCoverage();
