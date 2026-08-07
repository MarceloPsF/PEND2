//Classe é o modelo do objeto, é a planta do objeto.
class Aluno{
    constructor(nome, idade, curso, matricula) {

        //
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.matricula = matricula;
    }

    //Métodos (Ações)

    Aprender(){
        console.log(`${this.nome} está aprendendo`);
    }

    Estudar(){
        console.log(`${this.nome} está estudando`);
    }

    Apresentar(){
        console.log(`${this.nome} está se apresentando`);
    }
}
    //objeto1
    const aluno1 = new Aluno("João", 20, "Engenharia", 12345);
    console.log("Aluno 1: ", aluno1);

    //objeto2
    const aluno2 = new Aluno("Maria", 22, "Medicina", 54321);
    console.log("Aluno 2: ", aluno2);

    //objeto3
    const aluno3 = new Aluno("Pedro", 19, "Direito", 98765);
    console.log("Aluno 3: ", aluno3);

    console.log("---------------------------------");
    console.log("Atributos do aluno 1: ");
    console.log("- ", aluno1.nome);
    console.log("- ", aluno1.idade);
    console.log("- ", aluno1.curso);
    console.log("- ", aluno1.matricula);
    
    
    console.log("---------------------------------");
    console.log("Atributos do aluno 2: ");
    console.log("- ", aluno2.nome);
    console.log("- ", aluno2.idade);
    console.log("- ", aluno2.curso);
    console.log("- ", aluno2.matricula);
    console.log("---------------------------------");


    console.log("Atributos do aluno 3: ");
    console.log("- ", aluno3.nome);
    console.log("- ", aluno3.idade);
    console.log("- ", aluno3.curso);
    console.log("- ", aluno3.matricula);
    console.log("---------------------------------");

    aluno2.Aprender();
    aluno3.Estudar();
    aluno1.Apresentar();