// pad(n: int, width: int, z: int
// n: number we are padding
// width: maximum width we are padding to
// z: character we are padding with 
function pad(n, width, z = 0)
{
	// Convert input number to a string
	n = n + '';
	
	// Return the padded number as a string
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// get_coverage(): void
function get_coverage()
{
	// Pokemon Types
	let types = {
		// Primary Type (Required)
		primary: document.getElementById("sel-type-primary"), 

		// Secondary Type (Optional)
		secondary: document.getElementById("sel-type-secondary")
	}
}