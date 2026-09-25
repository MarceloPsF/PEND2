const buscarUsuarios = document.getElementById("buscarUsuarios");
const resultado = document.getElementById("resultado");
const botao = document.getElementById("botao");

// botao.addEventListener("click", function() {


// fetch("https://jsonplaceholder.typicode.com/users")
//     .then(resposta => resposta.json())
//     .then(dados => {
//         resultado.innerHTML = "";

//         dados.forEach(usuario => {

//             resultado.innerHTML += `
//                 <p>
//                     <strong>${usuario.name}</strong><br>
//                     ${usuario.email}
//                 </p>
//                 <hr>
//             `;
//         });
//     })
//     .catch(erro => {
//         console.log("Erro: ", erro);
//     });
botao.addEventListener("click", function() {
try{

    const resposta = await fetch(
        "https://jsonplaceholder.typicode.com/users"
    );

    const dados = await resposta.json();

    resultado.innerHTML = "";-

        dados.forEach(usuario => {

            resultado.innerHTML += `
                <p>
                    <strong>${usuario.name}</strong><br>
                    ${usuario.email}
                </p>
                <hr>
            `;
        });
    })
    .catch(erro => {
        console.log("Erro: ", erro);
    });