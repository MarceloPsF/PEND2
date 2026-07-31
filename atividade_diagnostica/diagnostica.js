const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", function(event){

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if(nome === ""){
        resultado.textContent = "Por favor, informe seu nome.";
        resultado.style.color = "red";
        return;
    }

    if(email === ""){
        resultado.textContent = "Por favor, informe seu e-mail.";
        resultado.style.color = "red";
        return;
    }

    if(!email.includes("@") || !email.includes(".")){
        resultado.textContent = "Digite um e-mail válido.";
        resultado.style.color = "red";
        return;
    }

    if(mensagem.length < 10){
        resultado.textContent = "A mensagem deve ter pelo menos 10 caracteres.";
        resultado.style.color = "red";
        return;
    }

    resultado.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso. Entrarei em contato pelo e-mail ${email}.`;
    resultado.style.color = "green";

    formulario.reset();
});