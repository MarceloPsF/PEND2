navigator.geolocation.getCurrentPosition(
    function(posicao) {
        console.log("Latitude: ", posicao.coords.latitude);
        console.log("Longitude: ", posicao.coords.longitude);
        console.log("Precisão: ", posicao.coords.accuracy);
        document.getElementById("gpsOn").style.display = "block";
    },

    function(erro) {
        console.log("Não foi possível obter a localização.")
        document.getElementById("gpsOff").style.display = "block";
    }
);