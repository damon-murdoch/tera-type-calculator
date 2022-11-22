// sub_map(a: map, b: map): map
// Given two maps, subtracts 'b' from 'a' and returns
// the result. If one map is smaller than the other,
// returns a map with the size of the biggest.
function sub_map(a,b)
{
	// Pick the longer array for the x value
	x = a.lenth > b.length ? a.length : b.length;
	
	// Pick the longer array for the y 
	y = a[0].lenth > b[0].length ? a[0].length : b[0].length;
	
	// Generate a new map to store the results
	let map = get_map(x,y,0);
	
	// Iterate over x
	for(let i=0; i<x; i++)
	{
		// Iterate over y
		for(let j=0; j<y; j++)
		{
			// If a is smaller than the current size
			if (a.length <= i || a[0].length <= j)
			{
				// Set the value to that of -b
				map[i][j] = 0 - b[i][j];
			}
			// If b is smaller than the current size
			else if (b.length <= i || b[0].length <= j)
			{
				// Set the value to that of a
				map[i][j] = a[i][j];
			}
			else 
			{
				// Set the value to that of the combination of a and b
				map[i][j] = a[i][j] - b[i][j];
			}
		}
	}
	
	// Return the new map to the calling process
	return map;
}

// row_sum(a: map, n: int): int
// Given a map and an int, return the sum
// of all of the values in the map at row
// 'n'. 
function row_sum(a,n)
{
	// Set sum to zero
	let sum = 0;
	
	// Iterate over the values in the row
	for(let i=0; i<a.length; i++)
	{
		// Add current index to sum
		sum += a[i][n];
	}
	
	// Return the total sum
	return sum;
}

// col_sum(a: map, n: int): int
// Given a map and an int, return the sum
// of all of the values in the map at col_sum
// 'n'.
function col_sum(a,n)
{
	// Set sum to zero
	let sum = 0;
	
	// Iterate over the values in the column
	for(let i=0; i<a[n].length; i++)
	{
		// Add current index to sum
		sum += a[n][i];
	}
	
	// Return the total sum
	return sum;
}

// add_map(a: map, b: map): map
// Given two maps, adds them together and returns
// the result. If one map is smaller than the other,
// returns a map with the size of the biggest.
function add_map(a,b)
{
	// Pick the longer array for the x value
	x = a.lenth > b.length ? a.length : b.length;
	
	// Pick the longer array for the y 
	y = a[0].lenth > b[0].length ? a[0].length : b[0].length;
	
	// Generate a new map to store the results
	let map = get_map(x,y,0);
	
	// Iterate over x
	for(let i=0; i<x; i++)
	{
		// Iterate over y
		for(let j=0; j<y; j++)
		{
			// If a is smaller than the current size
			if (a.length <= i || a[0].length <= j)
			{
				// Set the value to that of b
				map[i][j] = b[i][j];
			}
			// If b is smaller than the current size
			else if (b.length <= i || b[0].length <= j)
			{
				// Set the value to that of a
				map[i][j] = a[i][j];
			}
			else 
			{
				// Set the value to that of the combination of a and b
				map[i][j] = a[i][j] + b[i][j];
			}
		}
	}
	
	// Return the new map to the calling process
	return map;
}

// get_map(x: int, y: int, value: object)
// Given an x size, a y size and an optional value, 
// creates a two-dimensional array [X,Y] and fills 
// all of the entries with the value provided, 
// or the default '0'.
function get_map(x,y,value=0)
{
	// Create a new single-dimensional array
	// with the set length 'size'
	let map = new Array(x);
	
	// Iterate over each row in the array
	for(let i=0; i<x; i++)
	{
		// Declare a new array in the array index
		// with the set length 'size'
		map[i] = new Array(y);
		
		// All values are initialised to 'value'
		map[i].fill(value);
	}	
	https://stackoverflow.com/tags
	// Return the new map to the calling process
	return map;
}