var fs = require('fs');
var wav = require('wav');
var Analyser = require('audio-analyser');
var Generator = require('audio-generator');
const WavDecoder = require("wav-decoder");


const readFile = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, buffer) => {
            if (err) {
                return reject(err);
            }
            return resolve(buffer);
        });
    });
};

var analyser = new Analyser({
    // Magnitude diapasone, in dB
    minDecibels: -100,
    maxDecibels: -30,

    // Number of time samples to transform to frequency
    fftSize: 1024,

    // Number of frequencies, twice less than fftSize
    frequencyBinCount: 1024 / 2,

    // Smoothing, or the priority of the old data over the new data
    smoothingTimeConstant: 0.2,

    // Number of channel to analyse
    channel: 0,

    // Size of time data to buffer
    bufferSize: 44100,

    // Windowing function for fft, https://github.com/scijs/window-functions
    applyWindow: function (sampleNumber, totalSamples) {}

    //...pcm-stream params, if required
});

readFile("musik.wav").then((buffer) => {
    return WavDecoder.decode(buffer);
}).then(function (audioData) {
    // console.log(audioData.sampleRate);
    // console.log(audioData.channelData[0]); // Float32Array
    // console.log(audioData.channelData[1]); // Float32Array
    console.log(analyser.getByteTimeDomainData(audioData));
    var json = analyser.getFrequencyData(audioData);

    fs.writeFile("test.json", JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log('complete');
    });



    //console.log(analyser.getByteFrequencyData(audioData));
});
