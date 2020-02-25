"use strict";

import {random, randomPastelColor, requestFullscreen} from './utils.js';
import {drawRectangle, drawCircle, drawLine, drawTriangle, drawArc, drawBezier} from  './canvas-utils.js';
export {init};
        
// CONSTANTS
const SONG_PATH = Object.freeze({
    song1: "media/shooting_stars.mp3",
    song2: "media/sweater_song.mp3",
    song3: "media/deja_vu.mp3",
    song4: "media/keep_close.mp3"
});

const NUM_SAMPLES = 256;

// Page Elements
let canvasElement, audioElement, gui;

// Audio and Canvas contexts
let audioCtx, drawCtx;

// Web Audio
let sourceNode, analyserNode, waveShaperNode, gainNode;

let audioData = new Uint8Array(NUM_SAMPLES/2);

// Canvas Variables
let canvasWidth, canvasHeight;

// Visualizer variables
let channelAmount = 64, pointRadius = 5, pointAlpha = 0.5, waveDistortion = 0, dataType = "frequency";

// Pixel effect variables
let invert = false, tintPurple = false, neonNoise = false, grayscale = false;

// Variables for drawing sound data
let waveStart = null;

// FUNCTIONS

// Initialize all the neccessary page elements
function init() { 
    setupWebAudio();
    setupCanvas();
    setupUI();
    update();
}

// Initializes all web audio variables and data
function setupWebAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    audioElement = document.querySelector("audio");
    audioElement.src = SONG_PATH.song1;
    
    // Source node
    sourceNode = audioCtx.createMediaElementSource(audioElement);
    
    // Analyser node
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = NUM_SAMPLES;
    
    // Wave shaper node
    waveShaperNode = audioCtx.createWaveShaper();
    waveShaperNode.curve = makeDistortionCurve(waveDistortion);
    
    // Gain node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    
    // Connect all nodes together sequentially
    sourceNode.connect(analyserNode);
    analyserNode.connect(waveShaperNode);
    waveShaperNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

// Function used to create distortion wave
// Code obtained from here: 
// https://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
function makeDistortionCurve(amount) {
    let k = amount;
    let n_samples = NUM_SAMPLES;
    let curve = new Float32Array(n_samples);
    let deg = Math.PI / 180;
    let x;
    
    for(let i = 0; i < n_samples; i++) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    
    return curve;
};

// Initialize our canvas context and variables
function setupCanvas() {
    canvasElement = document.querySelector("canvas");
    drawCtx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
}

// Contstruct our UI and controls
// Makes use of the dat.gui library
// Library and instructions I used were found here:
// https://workshop.chromeexperiments.com/examples/gui/
function setupUI() {
    // Update document body background to be black
    document.body.style.backgroundColor = "black";
    
    // Build our controls for the visualization
    gui = new dat.GUI();
    
    // Initialize folders and controls to add to gui
    let controls = new function() {
        this.currentSong = "Shooting Stars";
        this.channelNum = channelAmount;
        this.pointRad = pointRadius;
        this.pointAlpha = pointAlpha;
    };
    
    let fullscreenButton = {
        clicked: function() { requestFullscreen(canvasElement); }
    }
    
    let waveFormOptions = new function() {
        this.frequencyData = true;
        this.waveformData = false;
    };
        
    let distortionOptions = new function() {
        this.waveShaper = waveDistortion;
    };
    
    let pixelOptions = new function() {
        this.invert = invert;
        this.tintPurple = tintPurple;
        this.neonNoise = neonNoise;
        this.grayscale = grayscale;
    };
    
    // Track select control
    gui.add(controls, "currentSong", ["Shooting Stars", "Sweater Song", "Déjà Vu", "Keep Close"]).name("Track:").onChange(
        function(value) {
            switch(value) {
                case "Shooting Stars":
                    audioElement.src = SONG_PATH.song1;
                    break;
                case "Sweater Song":
                    audioElement.src = SONG_PATH.song2;
                    break;
                case "Déjà Vu":
                    audioElement.src = SONG_PATH.song3;
                    break;
                case "Keep Close":
                    audioElement.src = SONG_PATH.song4;
                    break;
            }
        }
    );
    
    // Fullscreen button
    gui.add(fullscreenButton, "clicked").name("Fullscreen");
    
    // Create folders for remaining controls
    let soundData = gui.addFolder("Sound Data:");
    let pixelEffects = gui.addFolder("Pixel Effects");
     
    // Sound data radio button controls
    soundData.add(waveFormOptions, "frequencyData").name("Frequency Data:").listen().onChange(
        function(value) {
            if(value) { 
                dataType = "frequency";
                waveFormOptions.waveformData = !value;
            }
            else {
                dataType = "waveform";
                waveFormOptions.waveformData = !value;
            }
        }
    );
    soundData.add(waveFormOptions, "waveformData").name("Waveform Data:").listen().onChange(
        function(value) {
            if(value) { 
                dataType = "waveform";
                waveFormOptions.frequencyData = !value;
            }
            else {
                dataType = "frequency";
                waveFormOptions.frequencyData = !value;
            }
        }
    );
    soundData.add(distortionOptions, "waveShaper", 0, 100).step(1).name("Distortion:").onChange(
        function(value) { 
            waveDistortion = value; 
            waveShaperNode.curve = makeDistortionCurve(waveDistortion);
        }
    );
    
    // Pixel options controls
    pixelEffects.add(pixelOptions, "invert").name("Invert:").onChange(
        function(value) { invert = value; }
    );
    pixelEffects.add(pixelOptions, "tintPurple").name("Tint Purple:").onChange(
        function(value) { tintPurple = value; }
    );
    pixelEffects.add(pixelOptions, "neonNoise").name("Neon Noise:").onChange(
        function(value) { neonNoise = value; }
    );
    pixelEffects.add(pixelOptions, "grayscale").name("Grayscale:").onChange(
        function(value) { grayscale = value; }
    );
    
    // Channel number control
    gui.add(controls, "channelNum", [1, 2, 4, 8, 16, 32, 64]).name("Channel Number:").onChange(
        function(value) { channelAmount = value; }
    );
    
    // Point radius control
    gui.add(controls, "pointRad", 0, 10).step(0.01).name("Point Radius:").onChange(
        function(value) { pointRadius = value; }
    );
    
    // Point alpha control
    gui.add(controls, "pointAlpha", 0.25, 1).step(0.01).name("Point Alpha:").onChange(
        function(value) { pointAlpha = value; }
    );
}

// Function called rougly 60 times a second to update graphics
function update() {
    requestAnimationFrame(update);
    
    if(waveStart >= audioData.length - 1 || waveStart == null) {
        waveStart = 0;
    }
    
    // Check if frequency data or waveform data is selected
    if(dataType == "frequency") analyserNode.getByteFrequencyData(audioData);
    if(dataType == "waveform") analyserNode.getByteTimeDomainData(audioData);
    
    // Redraw black background
    drawRectangle(drawCtx, 0, 0, canvasWidth, canvasHeight, "black");
    
    // Useful variables
    const topSpacing = 50;
    let audioDataAvg = 0, audioDataTotalAvg = 0;
    const channelLength = audioData.length / channelAmount;
    let highestAudioPoint = 0, highestAudioPointPosition = 0;
    
    // Save values for later
    for(let i = 0; i < audioData.length; i++) {
        audioDataTotalAvg += audioData[i];
        
        // Save data of loudest bin for use in curve drawing
        if(audioData[i] > highestAudioPoint) {
            highestAudioPoint = audioData[i];
            highestAudioPointPosition = i;
        }
    }
    
    // Calculate average of total frequency levels
    audioDataTotalAvg /= audioData.length;
    
    // Draw bin average channels
    for(let i = 1; i <= audioData.length; i++) {
          
        // Draw total frequency average curves and rectangles for channel (collection of bins) averages
        if(i % channelLength == 0) {
            // Draw channel average for previous bins
            audioDataAvg /= channelLength;
            
            // Create gradient to fill channel curves
            let gradient = drawCtx.createLinearGradient(((i - 1) - channelLength) * (canvasWidth / (NUM_SAMPLES/2)),
                                                        topSpacing + 256 - audioDataAvg + 100,
                                                        ((i - 1) - channelLength) * (canvasWidth / (NUM_SAMPLES/2)),
                                                        topSpacing + 256 - audioDataAvg);
            gradient.addColorStop(0, "dodgerblue");
            gradient.addColorStop(0.1, "lime");
            gradient.addColorStop(0.3, "yellow");
            gradient.addColorStop(0.5, "orange");
            gradient.addColorStop(0.7, "red");
            
            drawRectangle(drawCtx,
                          ((i - 1) - channelLength) * (canvasWidth / (NUM_SAMPLES/2)),
                          topSpacing + 256 - audioDataAvg,
                          channelLength * (canvasWidth / (NUM_SAMPLES/2)),
                          100, "purple", "purple", 0, 0.5);
            
            // Draw quadratic curve with height of total frequency average within each channel
            drawArc(drawCtx, ((i - 1) - channelLength) * (canvasWidth / (NUM_SAMPLES/2)),
                    topSpacing + 256 - audioDataAvg + 100,
                    ((i - 1) - channelLength) * (canvasWidth / (NUM_SAMPLES/2)) + channelLength * (canvasWidth / (NUM_SAMPLES/2)),
                    topSpacing + 256 - audioDataAvg + 100,
                    ((i - 1) - channelLength) * (canvasWidth / (NUM_SAMPLES/2)) + 0.5 * channelLength * (canvasWidth / (NUM_SAMPLES/2)),
                    topSpacing + 256 - audioDataAvg + 100 + (audioDataTotalAvg/255) * -250,
                    gradient, gradient, 0, 0.5, 0.5);
            
            // Reset avg variable to be used for next channel
            audioDataAvg = 0;
        }
        else {
            audioDataAvg += audioData[i - 1];
        }
    }
    
    // Draw audio data points as a line
    for(let i = 0; i < audioData.length; i++) {   
        
        // Draw each segment of the line
        drawLine(drawCtx, i * (canvasWidth / (NUM_SAMPLES/2)),
                 topSpacing + 256 - audioData[i],
                 (i + 1) * (canvasWidth / (NUM_SAMPLES/2)),
                 topSpacing + 256 - audioData[i+1],
                 "red", 2);
        
        // Draw a dot on each point   
        drawCircle(drawCtx, i * (canvasWidth / (NUM_SAMPLES/2)),
                   topSpacing + 256 - audioData[i], pointRadius,
                   "blue", "blue", 0, 0, Math.PI * 2, pointAlpha);
    }
    
    // Draw bezier curve from start of level line to end with control points
    drawBezier(drawCtx, waveStart * (canvasWidth / (NUM_SAMPLES/2)),
               topSpacing + 256 - audioData[waveStart],
               (waveStart + channelLength) * (canvasWidth / (NUM_SAMPLES/2)),
               topSpacing + 256 - audioData[waveStart + channelLength],
               (waveStart + channelLength/3) * (canvasWidth / (NUM_SAMPLES/2)),
               topSpacing + 256 - audioData[waveStart] - highestAudioPoint,
               (waveStart + (channelLength/3)*2) * (canvasWidth / (NUM_SAMPLES/2)),
               topSpacing + 256 - audioData[waveStart + channelLength] + highestAudioPoint, "white", "white", 1, 0, 1);

    
    // Add user selected effects
    manipulatePixels(drawCtx);
        
    waveStart++;
}

// Used to edit pixel values to add effects
function manipulatePixels(ctx) {
    // Get all the rgba pixels of the canvas
    let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    // imageData.data is an 8-bit typed array (values are 0-255)
    // 4 values per pixel: 4 x canvas.width x canvas.height;
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    let i;
    for(i = 0; i < length; i += 4) {
        // Tint purple
        if(tintPurple) {
            data[i] = data[i] + 100;
            data[i + 2] = data[i + 2] + 100;
            
            if(data[i] > 255) data[i] = 255;
            if(data[i + 2] > 255) data[i + 2] = 255;
        }

        // Invert colors
        if(invert) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
        }

        // Randon neon noise
        if(neonNoise && Math.random() < .10) {
            data[i] = 0;
            data[i + 1] = 255;
            data[i + 2] = 0;
            data[i + 3] = 255;
        }

        // Grayscale
        if(grayscale) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];

            let newColorValue = (red + green + blue) / 3;
            data[i] = newColorValue;
            data[i + 1] = newColorValue;
            data[i + 2] = newColorValue;
        }
    }

    // Put image data back onto canvas
    ctx.putImageData(imageData, 0, 0);
}