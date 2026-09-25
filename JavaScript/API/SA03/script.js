async function buscarReceita() {

    // Pega o texto digitado
    let nome = document.getElementById("receita").value;

    // Pega os elementos da página
    let resultado = document.getElementById("resultado");
    let mensagem = document.getElementById("mensagem");

    // Limpa os resultados anteriores
    resultado.innerHTML = "";

    // Verifica se o usuário digitou alguma coisa
    if (nome == "") {
        mensagem.innerHTML = "Digite o nome de uma receita.";
        return;
    }

    mensagem.innerHTML = "Buscando receita...";

    try {

        // Faz a requisição para a API
        let resposta = await fetch(
            "https://www.themealdb.com/api/json/v1/1/search.php?s=" + nome
        );

        // Converte a resposta para JSON
        let dados = await resposta.json();

        // Verifica se encontrou alguma receita
        if (dados.meals == null) {

            mensagem.innerHTML = "Nenhuma receita encontrada.";
            return;
        }

        mensagem.innerHTML = "Receitas encontradas:";

        // Percorre as receitas encontradas
        for (let i = 0; i < dados.meals.length; i++) {

            let receita = dados.meals[i];

            // Cria um card
            let card = document.createElement("div");

            card.classList.add("card");

            // Coloca as informações dentro do card
            card.innerHTML = `
                <img src="${receita.strMealThumb}" alt="${receita.strMeal}">

                <div class="card-conteudo">

                    <h2>${receita.strMeal}</h2>

                    <p>
                        <strong>Categoria:</strong>
                        ${receita.strCategory}
                    </p>

                    <p>
                        <strong>Origem:</strong>
                        ${receita.strArea}
                    </p>

                    <button onclick="mostrarReceita('${receita.idMeal}')">
                        Ver receita
                    </button>

                </div>
            `;

            // Adiciona o card na página
            resultado.appendChild(card);
        }

    } catch (erro) {

        mensagem.innerHTML = "Ocorreu um erro ao buscar a receita.";

        console.log(erro);
    }
}


async function mostrarReceita(id) {

    try {

        // Busca uma receita específica pelo ID
        let resposta = await fetch(
            "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
        );

        let dados = await resposta.json();

        let receita = dados.meals[0];

        // Cria uma mensagem com as informações
        alert(
            "Receita: " + receita.strMeal +
            "\n\nCategoria: " + receita.strCategory +
            "\nOrigem: " + receita.strArea +
            "\n\nModo de preparo:\n" +
            receita.strInstructions
        );

    } catch (erro) {

        console.log(erro);

        alert("Não foi possível carregar a receita.");
    }
}