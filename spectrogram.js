let spectrogramCanvas;
let spectrogramContext;
let analyserSpectrogram;

function initSpectrogram(context, filter) {
    spectrogramCanvas = document.getElementById('spectrogramCanvas');
    spectrogramContext = spectrogramCanvas.getContext('2d');
    analyserSpectrogram = new AnalyserNode(context);
    filter.connect(analyserSpectrogram);
    analyserSpectrogram.fftSize = 2048;

    drawSpectrogram();
}

function drawSpectrogram() {
    const bufferLength = analyserSpectrogram.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvasWidth = spectrogramCanvas.width;
    const canvasHeight = spectrogramCanvas.height;

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        analyserSpectrogram.getByteFrequencyData(dataArray);

        spectrogramContext.fillStyle = 'rgb(255, 255, 255)';
        spectrogramContext.fillRect(0, 0, canvasWidth, canvasHeight);

        const barWidth = canvasWidth / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] * canvasHeight / 256;

            // Create a linear gradient for the fill style
            const gradient = spectrogramContext.createLinearGradient(0, canvasHeight - barHeight, 0, canvasHeight);
            gradient.addColorStop(0, 'rgb(' + (dataArray[i] + 100) + ', 50, 50)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            spectrogramContext.fillStyle = gradient;

            // Use fill() method instead of fillRect() to draw the bars
            spectrogramContext.beginPath();
            spectrogramContext.moveTo(x, canvasHeight - barHeight);
            spectrogramContext.lineTo(x, canvasHeight);
            spectrogramContext.lineTo(x + barWidth, canvasHeight);
            spectrogramContext.lineTo(x + barWidth, canvasHeight - barHeight);
            spectrogramContext.closePath();
            spectrogramContext.fill();

            x += barWidth + 1;
        }
    }

    renderFrame();
}
