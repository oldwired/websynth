function buildsynth() {
    const context = new AudioContext();

    // Oscillators
    const osc1 = context.createOscillator();
    const osc2 = context.createOscillator();

    // Filter
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';

// Gain nodes for oscillators
    const osc1Gain = context.createGain();
    const osc2Gain = context.createGain();

    // Gain
    const gain = context.createGain();
    gain.gain.value = 0;

    // Connect nodes
    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc1Gain.connect(gain);
    osc2Gain.connect(gain);
    gain.connect(filter);
    filter.connect(context.destination);

    // Get HTML elements
    const waveform1 = document.getElementById('osc1_waveform');
    const waveform2 = document.getElementById('osc2_waveform');
    const pitch1 = document.getElementById('osc1_pitch');
    const pitch2 = document.getElementById('osc2_pitch');
    const cutoff = document.getElementById('filter_cutoff');
    const resonance = document.getElementById('filter_resonance');
    const osc1Level = document.getElementById('osc1_level');
    const osc2Level = document.getElementById('osc2_level');

// Set initial gain values for oscillators
    osc1Gain.gain.value = osc1Level.value;
    osc2Gain.gain.value = osc2Level.value;

    // Set initial oscillator properties
    osc1.type = waveform1.value;
    osc2.type = waveform2.value;
    osc1.frequency.value = pitch1.value;
    osc2.frequency.value = pitch2.value;

// Enable oversampling for the oscillators
    osc1.oversample = '4x';
    osc2.oversample = '4x';

    // Set initial filter properties
    filter.frequency.value = cutoff.value;
    filter.Q.value = resonance.value;

// Update oscillator levels on change
    osc1Level.addEventListener('input', () => {
        osc1Gain.gain.value = osc1Level.value;
    });

    osc2Level.addEventListener('input', () => {
        osc2Gain.gain.value = osc2Level.value;
    });

    // Update oscillator waveform on change
    waveform1.addEventListener('change', () => {
        osc1.type = waveform1.value;
    });

    waveform2.addEventListener('change', () => {
        osc2.type = waveform2.value;
    });

    // Update oscillator pitch on change
    pitch1.addEventListener('input', () => {
        osc1.frequency.value = pitch1.value;
    });

    pitch2.addEventListener('input', () => {
        osc2.frequency.value = pitch2.value;
    });

    // Update filter cutoff and resonance on change
    cutoff.addEventListener('input', () => {
        filter.frequency.value = cutoff.value;
    });

    resonance.addEventListener('input', () => {
        filter.Q.value = resonance.value;
    });

    // Start oscillators
    osc1.start();
    osc2.start();

    // Adjust the gain value to control the volume
    gain.gain.value = 0.5;
    initVisualizer(context, filter);
    initSpectrogram(context, filter);
}
