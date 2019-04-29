const fs = require('fs');
const exec = require('exec');
const AudioContext = require('web-audio-api').AudioContext;
const context = new AudioContext;
let pcmdata = [];
let song = [];


const soundfile = "musik2.wav"
decodeSoundFile(soundfile);


function findPeaks(pcmdata, samplerate) {
    var interval = 0.10 * 1000;
    index = 0;
    var step = Math.round(samplerate * (interval / 1000));
    var max = 0;
    var prevmax = 0;
    var prevdiffthreshold = 0.3;
    var time =  0;
    var count = 0;
    //loop through song in time with sample rate
    var samplesound = setInterval(function () {
        if (index >= pcmdata.length) {
            clearInterval(samplesound);



            fs.writeFile("test.json", JSON.stringify(song), function (err) {
                if (err) throw err;
                console.log('complete');
            });

            console.log("finished sampling sound")
            return;
        }

        for (var i = index; i < index + step; i++) {
            max = pcmdata[i] > max ? pcmdata[i].toFixed(1) : max;
        }

        // Spot a significant increase? Potential peak
        bars = getbars(max);
        if (max - prevmax >= prevdiffthreshold) {
            bars = bars + " == peak == "
        }

        // time
        count ++;
        time = (count * 100) / 1000;

        let pcmnew = [];
        let fullfeq = 0;
        for (let i = 0; i < 256; i++) {
            for (let j = i * 661; j < (i +1) * 661; j++) {
                fullfeq = fullfeq + parseFloat(pcmdata[j]);
            }
            pcmnew.push(fullfeq);
            song.push(time = {
                vol: max,
                feq: pcmnew
            });
        }
        

        // Print out mini equalizer on commandline
        console.log(bars, max, time);
        //console.log(pcmdata);

        prevmax = max;
        max = 0;
        index += step;
    }, interval, pcmdata);
}

 function getbars(val) {
     bars = ""
     for (var i = 0; i < val * 50 + 2; i++) {
         bars = bars + "|";
     }
     return bars;
 }

 function playsound(soundfile) {
     // linux or raspi
     // var create_audio = exec('aplay'+soundfile, {maxBuffer: 1024 * 500}, function (error, stdout, stderr) {
     var create_audio = exec('ffplay -autoexit ' + soundfile, {
         maxBuffer: 1024 * 500
     }, function (error, stdout, stderr) {
         if (error !== null) {
             console.log('exec error: ' + error);
         } else {
             //console.log(" finshed ");
             //micInstance.resume();
         }
     });
 }



function decodeSoundFile(soundfile) {
    console.log("decoding mp3 file ", soundfile, " ..... ")
    fs.readFile(soundfile, function (err, buf) {
        if (err) throw err
        context.decodeAudioData(buf, function (audioBuffer) {
            console.log(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate, audioBuffer.duration);
            pcmdata = (audioBuffer.getChannelData(0));
            samplerate = audioBuffer.sampleRate; // store sample rate
            maxvals = [];
            max = 0;
            playsound(soundfile)
            console.log(pcmdata[10000]);
            findPeaks(pcmdata, samplerate);
        }, function (err) {
            throw err
        })
    })
}
