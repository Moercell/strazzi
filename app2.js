const fs = require('fs');
const AudioContext = require('web-audio-api').AudioContext;
const context = new AudioContext;

const soundfile = "musik.wav"

decodeSoundFile(soundfile, 1, 3, function(result){
    // push to db
    console.log(result);    
});

function getVolume(pcmdata, samplerate, accuracy){
    let max = 0;
    let lastLoop = false;
    const reducedVols = [];

    for (let i = 0; i < pcmdata.length; i++) {
       max = pcmdata[i] > max ? pcmdata[i].toFixed(accuracy) : max;
       if (!lastLoop) {
    
            if (i % samplerate === 0 && i !== 0) {
                reducedVols.push(parseFloat(max));
                max = 0;
                if (i + samplerate > pcmdata.length) {
                    lastLoop = true;
                }
            }
        }else{
            if (i >= pcmdata.length - 1 ) {
                reducedVols.push(parseFloat(max));
            }
        }
    }
    return reducedVols;    
}

function decodeSoundFile(soundfile, sampleRateModifier = 1, accuracy = 3, cbFunction) {
    console.log("decoding sound file ", soundfile, " ..... ")
    fs.readFile(soundfile, function (err, buf) {
        if (err) throw err
        context.decodeAudioData(buf, function (audioBuffer) {
            
            let pcmdata = (audioBuffer.getChannelData(0));
            let samplerate = audioBuffer.sampleRate; // store sample rate
            let volumes = getVolume(pcmdata, samplerate / sampleRateModifier, accuracy);
            
            cbFunction({
                originalSampleRate: samplerate,
                sampleRate: sampleRateModifier,
                duration: parseFloat(audioBuffer.duration.toFixed(2)),
                waveData: volumes
                
            });

        }, function (err) {
            throw err
        })
    })
}
