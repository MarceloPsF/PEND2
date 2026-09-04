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