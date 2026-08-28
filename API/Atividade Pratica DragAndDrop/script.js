
const gato = document.getElementById("gato");
const caixa = document.getElementById("caixa");
const mensagem = document.getElementById("mensagem");

gato.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("text", "gato");
});

caixa.addEventListener("dragover", function(event) {
    event.preventDefault();
});

caixa.addEventListener("drop", function(event) {
    event.preventDefault();

    const objeto = event.dataTransfer.getData("text");

    if (objeto === "gato") {
        caixa.innerHTML = "🐱";
        gato.style.display = "none";
        mensagem.innerHTML = "🎉 Você ganhou!";
    }
});
