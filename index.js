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
function getTeraStrength(type, coverage, strict = false) {

	// Strength Value:
	// 4x Weakness -> Immune: 4 Points
	// 4x Weakness -> Resist: 3 Points
	// 4x Weakness -> Neutral: 2 Points
	// 4x Weakness -> 2x Weakness: 1 Point

	// 2x Weakness -> Immune: 3 Points
	// 2x Weakness -> Resist: 2 Points
	// 2x Weakness -> Neutral: 1 Point

	// Neutral -> Neutral: 0 Points

	// STRICT MODE:

	// 4x Resist -> 2x Resist: -1 Point
	// 4x Resist -> Neutral: -2 Points
	// 4x Resist -> 2x Weak: -3 Points
	// 4x Resist -> 4x Weak: -4 Points

	// 2x Resist -> Neutral: -1 Point
	// 2x Resist -> 2x Weak: -2 Points
	// 2x Resist -> 4x Weak: -3 Points

	// Tera Type Strength
	strength = {

		// Resistances gained / lost
		resistancesGained: 0,
		resistancesShared: 0,

		// Weaknesses gained / lost
		weaknessesGained: 0,
		weaknessesShared: 0,

		// Calculated as above
		totalStrength: 0,

		// If strict was enabled
		strict: strict
	}

	// Get the type coverage for the given type
	let teraCoverage = getTypeCoverage(type);

	// Loop over the keys
	for (let type of Object.keys(Types)) {

		// Weakness / neutrality
		if (coverage[type] <= 0) {
			// If tera type resists, increment resists gained
			if (teraCoverage[type] > 0) strength.resistancesGained++;

			// If the tera type is also weak, increment weaknesses shared
			if (teraCoverage[type] < 0) strength.weaknessesShared++;

			// Calculate the 'strength' value for the given type
			strength.totalStrength += (teraCoverage[type] + Math.abs(coverage[type]));
		}
		else // Resistance / immunity
		{
			// If tera type resists, increment resists gained
			if (teraCoverage[type] < 0) strength.weaknessesGained++;

			// If the tera type is also weak, increment weaknesses shared
			if (teraCoverage[type] > 0) strength.resistancesShared++;

			// If strict mode is enabled
			if (strict) {
				// Modify the strength value based upon the resistance changing
				strength.totalStrength -= (teraCoverage[type] + Math.abs(coverage[type]));
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

function getTypeCoverage(type) {

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
	return typeCoverage;
}

// getCoverage(): void
function getCoverage() {
	// Pokemon Types
	let types = {
		// Primary Type (Required)
		primary: document.getElementById("sel-type-primary").value,

		// Secondary Type (Optional)
		secondary: document.getElementById("sel-type-secondary").value
	}

	// Get the coverage for the primary type
	let coverage = getTypeCoverage(types.primary);

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
		let strength = getTeraStrength(type, coverage, false);

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
		results.innerHTML += "<tr>" +
			"<th>" + rank + "</th>" +
			"<td><img src='img/type/sm/" + type.type + ".png'></img></td>" +
			"<td>" + type.strength.totalStrength + "</td>" + // Strength
			"<td>" + type.strength.resistancesGained + "</td>" + // Resistances Gained
			"<td>" + type.strength.resistancesShared + "</td>" + // Resistances Shared
			"<td>" + type.strength.weaknessesGained + "</td>" + // Weaknesses Gained
			"<td>" + type.strength.weaknessesShared + "</td>" + // Weaknesses Shared
			"</tr>";

		// Increment the rank
		rank++;
	}
}

getCoverage();