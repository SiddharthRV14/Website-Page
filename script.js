const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let mediaRecorder;
let recordedChunks = [];

/* Access Camera */
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        video.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = saveVideo;
    })
    .catch(err => {
        alert("Camera access denied!");
        console.error(err);
    });

/* Capture Image */
function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `image_${Date.now()}.png`;
        link.click();
    });
}

/* Start Video Recording */
function startRecording() {
    recordedChunks = [];
    mediaRecorder.start();
    alert("Recording Started");
}

/* Stop Video Recording */
function stopRecording() {
    mediaRecorder.stop();
    alert("Recording Stopped");
}

/* Save Video */
function saveVideo() {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `video_${Date.now()}.webm`;
    link.click();
}
