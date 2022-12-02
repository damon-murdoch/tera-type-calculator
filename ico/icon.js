

// setIcon(odds: number): Void
// When called, sets the icon for the website to the 'dragapult' 
// sprite, or when the chances specified by 'odds' are satisfied
// the 'dragapult-shiny' sprite is used.
function getIcon(odds = 4096) {

    // Returns true if the random number generated, when
    // rounded to the nearest whole number, equals zero
    let shiny = Math.round(Math.random() * odds) == 0;

    // If shiny is set to true, use the shiny sprite. Otherwise, use the normal one
    let sprite = shiny ? "ico/dragapult-shiny.ico" : "ico/dragapult.ico";

    // Create a link element for the icon
    link = document.createElement('link');

    // Set the link relation to 'icon'
    link.rel = 'icon';

    // Set the link href to the sprite
    link.href = sprite;

    // Add the link element to the head of the document
    document.getElementsByTagName('head')[0].appendChild(link);
}