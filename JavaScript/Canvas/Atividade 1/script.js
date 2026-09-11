const canvas = document.querySelector("#canvas");
const contexto = canvas.getContext("2d");


contexto.lineWidth = 4;
contexto.lineCap = "round";
contexto.lineJoin = "round";


contexto.beginPath();
contexto.arc(65, 76, 30, 0, Math.PI * 2);
contexto.stroke();


contexto.beginPath();
contexto.moveTo(60, 106);
contexto.lineTo(60, 178);


contexto.moveTo(60, 106);
contexto.lineTo(36, 130);
contexto.lineTo(72, 144);


contexto.moveTo(60, 106);
contexto.lineTo(84, 130);
contexto.lineTo(102, 112);


contexto.moveTo(60, 178);
contexto.lineTo(38, 206);
contexto.lineTo(38, 236);


contexto.moveTo(60, 178);
contexto.lineTo(82, 206);
contexto.lineTo(82, 236);
contexto.stroke();