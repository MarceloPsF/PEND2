navigator.geolocation.getCurrentPosition(
    function(posicao) {
        console.log("Latitude: ", posicao.coords.latitude);
        console.log("Longitude: ", posicao.coords.longitude);
        console.log("Precisão: ", posicao.coords.accuracy);
        document.getElementById("latitude").textContent = "Latitude: " + posicao.coords.latitude;
        document.getElementById("longitude").textContent = "Longitude: " + posicao.coords.longitude;
        document.getElementById("accuracy").textContent = "Precisão: " + posicao.coords.accuracy;
    },

    function(erro) {
        console.log("Não foi possível obter a localização.")
    }
);

const video = document.querySelector("#camera");
const canvas = document.querySelector("#canvas");
const botao = document.querySelector("#botao");
const foto = document.querySelector("#foto");

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(function(stream) {
    video.srcObject = stream;
})
.catch(function(erro) {
    console.log("Erro ao acessar a câmera: ", erro);
});

botao.addEventListener("click", function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const contexto = canvas.getContext("2d");
    contexto.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    foto.src = canvas.toDataURL("image/png");
});