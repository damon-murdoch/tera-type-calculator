// Colour Functions

// getColor(r: Number, g: Number, b: Number): Color
// Given a red, green and blue number object, 
function getColor(r = 0, g = 0, b = 0)
{
  // Any numbers greater than
  // the maximum for colours (255)
  // are passed through modulus in
  // order to remove the extra size.

  return {
    r: r % 256, // Red
    g: g % 256, // Green
    b: b % 256 // Blue
  }
}

// Given an arbitrary completion
// percentage (between 0 and 1), 
// where 0 is 0% and 1 is 100% 
// calculate the colour which
// should be displayed to 
// demonstrate that progress.
function getProgressColor(progress)
{
  // Less than or equal to 50%
  if (progress <= 0.5)
  {
    // Return max red value, green value as % of progress
    return getColor(255, Math.round((progress * 2) * 255), 0);
  }
  // Greater than 50%
  else if (progress > 0.5)
  {
    // Return max green value, red value as % of progress
    return getColor(Math.round((1 - (progress - 0.5) * 2) * 255), 255, 0);
  }

  // Bad argument provided
  return null;
}

// getColorStyle(color: Object)
// Given a color object with r, 
// g and b properties returns 
// the css string for the color.
function getColorStyle(color)
{
  // Return the css string for the provided colour
  return 'color: rgb(' + 
    color.r + ',' + // Red Colour Value
    color.g + ',' + // Green Colour Value
    color.b + ')'; // Blue Colour Value
}

// Colour Constants

// Plain White - Max out all values
COLOR_WHITE = getColor(255, 255, 255);

// Plain Red - Max out red only
COLOR_RED = getColor(255, 0, 0);

// Plain Green - Max out green only
COLOR_GREEN = getColor(0, 255, 0);

// Plain Blue - Max out blue only
COLOR_BLUE = getColor(0, 0, 255);

// Plain Black - All values are zero
COLOR_BLACK = getColor(0, 0, 0);