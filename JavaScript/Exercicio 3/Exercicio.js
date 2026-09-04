//Classe é o modelo do objeto, é a planta do objeto.
class Produto{
    constructor(nome, preco, estoque) {

        //
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }

    //Métodos (Ações)

    Vender(){
        console.log(`${this.nome} foi vendido.`);
    }

    Repor(){
        console.log(`O estoque de "${this.nome}" está sendo reabastecido.`);
    }

    AlterarPreco(){
        console.log(`${this.nome} teve seu preço alterado.`);
    }

}
    //objeto1
    const produto1 = new Produto("Notebook", 3000, 10);
    console.log("Produto 1: ", produto1);

    //objeto2
    const produto2 = new Produto("Mouse", 100, 50);
    console.log("Produto 2: ", produto2);

    //objeto3
    const produto3 = new Produto("Teclado", 200, 25);
    console.log("Produto 3: ", produto3);

    console.log("---------------------------------");
    console.log("Atributos do produto 1: ");
    console.log("- ", produto1.nome);
    console.log("- ", produto1.preco);
    console.log("- ", produto1.estoque);


    console.log("---------------------------------");
    console.log("Atributos do produto 2: ");
    console.log("- ", produto2.nome);
    console.log("- ", produto2.preco);
    console.log("- ", produto2.estoque);
    console.log("---------------------------------");


    console.log("Atributos do produto 3: ");
    console.log("- ", produto3.nome);
    console.log("- ", produto3.preco);
    console.log("- ", produto3.estoque);
    console.log("---------------------------------");

    produto2.Vender();
    produto3.Repor();
    produto1.AlterarPreco();