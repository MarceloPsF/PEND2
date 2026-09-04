class Produto {
    constructor(nome, preco, descricao, categoria) {
        this.nome = nome;
        this.preco = Number(preco);
        this.descricao = Number(descricao) || 0;
        this.categoria = categoria;
        this.precoComDesconto = this.preco;
    }

    aplicarDesconto() {
        const desconto = this.preco * (this.descricao / 100);
        this.precoComDesconto = this.preco - desconto;
    }

    exibir() {
        return `
            <p>Nome: ${this.nome}</p>
            <p>Preço: R$${this.preco.toFixed(2)}</p>
            <p>Desconto: ${this.descricao}%</p>
            <p>Preço com Desconto: R$${this.precoComDesconto.toFixed(2)}</p>
            <p>Categoria: ${this.categoria}</p>
        `;
    }
}

const nome = document.querySelector("#nome");
const preco = document.querySelector("#preco");
const descricao = document.querySelector("#descricao");
const categoria = document.querySelector("#categoria");
const botaoCadastrar = document.querySelector("#botaoCadastrar");
const produtos = [];

botaoCadastrar.addEventListener("click", function () {
    const produto = new Produto(nome.value, preco.value, descricao.value, categoria.value);
    produto.aplicarDesconto();
    produtos.push(produto);

    const resultado = document.querySelector("#resultado");
    resultado.innerHTML = produtos
        .map((item) => `<div>${item.exibir()}</div>`)
        .join("");
});