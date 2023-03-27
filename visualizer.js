let canvas;
let canvasContext;
let analyser;

function initVisualizer(context, filter) {
    canvas = document.getElementById('waveformCanvas');
    canvasContext = canvas.getContext('2d');
    analyser = new AnalyserNode(context);
    filter.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 2048;

    drawWaveform();
}

function drawWaveform() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    function renderFrame() {
        // Read the visualizer speed from the slider
        const visualizerSpeed = document.getElementById('visualizer_speed').value;
        const frameTime = 1000 / visualizerSpeed;

        // Use setTimeout instead of requestAnimationFrame to control the speed
        setTimeout(renderFrame, frameTime);

        analyser.getByteTimeDomainData(dataArray);

        canvasContext.fillStyle = 'rgb(255, 255, 255)';
        canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = 'rgb(0, 0, 0)';

        canvasContext.beginPath();

        canvasContext.lineWidth = 1; // Change the lineWidth value for a smoother waveform display

        const sliceWidth = canvasWidth * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvasHeight / 2;

            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasContext.lineTo(canvas.width, canvas.height / 2);
        canvasContext.stroke();
    }

    renderFrame();
}
