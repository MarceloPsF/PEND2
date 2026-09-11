const canvas = document.querySelector("#canvas");
const contexto = canvas.getContext("2d");

//Desenhando uma linha
contexto.beginPath();
contexto.moveTo(10, 0);
contexto.lineTo(50, 200);
contexto.lineTo(67, 67);
contexto.stroke();

//Desenhando um retângulo
contexto. fillRect(50, 50, 150, 100);
contexto.strokeRect(250, 50, 150, 100);

//Desenhando um círculo
contexto.beginPath();
contexto.arc(250, 250, 50, 0, Math.PI, true);
contexto.fill();