navigator.mediaDevices.getUserMedia({
    video: true, Audio: true
})
.then(function(stream) {
    const video = document.querySelector("#camera");
    video.srcObject = stream;
})
.catch(function(erro) {
    console.log("Erro ao acessar a câmera: ", erro);
});