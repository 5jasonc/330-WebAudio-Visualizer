export {random, randomPastelColor, requestFullscreen};

// Generate random number
function random(min, max) {
    return (Math.random() * (max - min)) + min;
}

// Return a random pastel color
function randomPastelColor() {
    let r = random(50, 200);
    let g = random(50, 200);
    let b = random(50, 200);
    return "rgb(" + r + "," + g + "," + b + ")";
}

// Try fullscreen for all browsers, do nothing if not supported
function requestFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
      element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
}