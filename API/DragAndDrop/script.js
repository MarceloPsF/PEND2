const produto = document.querySelector("#produtos");
const carrinho = document.querySelector("#carrinho");

//event = objeto fornecido pelo navegador que contém informações sobre o evento que ocorreu
//dataTransfer = objeto que permite transferir dados de um elemento para outro durante uma operação de arrastar e soltar
produto.addEventListener("dragstart", function (event) {
  event.dataTransfer.setData("text", event.target.id);
});

//Mudar o padrão

carrinho.addEventListener("dragover", function (event) {
    event.preventDefault();
    console.log("Pode soltar aqui no carrinho...");
});

//Soltar o produto no carrinho
carrinho.addEventListener("drop", function (event) {
    event.preventDefault();

    const id = event.dataTransfer.getData("text");
    const elemento = document.querySelector("#" + id);

    //a div do produto passa a ser filho da div do carrinho
    carrinho.appendChild(elemento);
});