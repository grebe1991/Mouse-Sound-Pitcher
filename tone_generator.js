(function () {
    var audio, isWebkit, oscillator, gainNode;

    // Create audio context
    if (window.AudioContext) {
        audio = new AudioContext();
    } else if (window.webkitAudioContext) {
        audio = new webkitAudioContext();
        isWebkit = true;
    } else {
        return false;
    }

    // Event handlers
    document.addEventListener('mousedown', startTone, false);
    document.addEventListener('mouseup', stopTone, false);
    document.getElementsByTagName('p')[0].innerHTML = 'Click and drag the mouse to generate a tone. Moving horizontally controls the volume. Moving vertically controls the tone.';

    function startTone() {
        // Create oscillator and gain node
        oscillator = audio.createOscillator();
        if (!isWebkit) {
            gainNode = audio.createGain();
        } else {
            gainNode = audio.createGainNode();
        }

        // Set waveform
        oscillator.type = 'triangle';

        // Link audio chain
        oscillator.connect(gainNode);
        gainNode.connect(audio.destination);
        oscillator.start();

        document.addEventListener('mousemove', controlSound, false);
    }

    function stopTone() {
        oscillator.stop();
        document.removeEventListener('mousemove', controlSound, false);
    }

    function controlSound(e) {
        var x = e.clientX,
            y = e.clientY,
            w = window.innerWidth,
            h = window.innerHeight,
            low = 261.63, // Middle C
            high = 523.25, // Tenor C
            range = high - low;
        gainNode.gain.value = x/w;
        oscillator.frequency.value = ((h - y) / h * range) + low;
    }
})();