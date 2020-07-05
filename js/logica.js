//Funcíón para que la tarea no pueda ser elegida antes del día en el que se registra.
function delimitarFecha () {
	var controlFecha = document.querySelector("input[name='fecha']");
	hoy = new Date();
	console.log(hoy);
	var dia = hoy.getDate();
	var mes = hoy.getMonth()+1;
	var ano = hoy.getFullYear();
	diaa = new String(dia);
	diaa = diaa.toString();
	mess = new String(mes);
	mess = mess.toString();
	anoo = new String(ano);
	anoo = anoo.toString();
	console.log(diaa);
	console.log(mess);
	console.log(anoo);
	if (mes < 10 && dia < 10){
		controlFecha.value = controlFecha.min = anoo + "-0" + mess + "-0" + diaa;
	}
	else if (mes < 10) {
		controlFecha.value = controlFecha.min = anoo + "-0" + mess + "-" + diaa;

	}
	else if (dia < 10) {
		controlFecha.value = controlFecha.min = anoo + "-" + mess + "-0" + diaa;

	}else {
		controlFecha.value = controlFecha.min = anoo + "-" + mess + "-" + diaa;
	}


}

//Llamado a la función delimitarFecha
delimitarFecha();

var form = document.getElementById('formulario');

//Evento para registar las tareas despues de llenar el formulario.
form.addEventListener('submit',function(e){
	e.preventDefault();

	var datos = new FormData(form);
	tarea = datos.get("tarea");
	fecha = datos.get("fecha");
	color = datos.get("color");

	let tareaObj = {
		nombre: tarea,
		fech: fecha,
		col: color
	};

	var tareas = document.getElementById("tasks");
	var div = document.createElement("DIV");
	var ntarea = document.createElement("button");
	var label = document.createElement("LABEL");
	var labelT = document.createElement("LABEL");

	div.style.backgroundColor = color;
	div.id = "id " + tarea;
	div.setAttribute('class', 'etiquetaA');

	ntarea.id = tarea;
	ntarea.setAttribute('class', 'tareaA');
	ntarea.setAttribute('onclick', 'eliminar(this)');
	ntarea.name = 'tarea';


	label.for = 'tarea';
	label.innerHTML = tarea;

	tiempo = calcularTiempo(tareaObj.fech);
	labelT.id = "tiempo " + tarea;
	labelT.innerHTML =  tiempo.diasRestantes + "d: "+ tiempo.horasRestantes + "h: "+ tiempo.minutosRestantes + "m: " + tiempo.segundosRestantes + "s"; 

	div.appendChild(ntarea);
	div.appendChild(document.createElement("br"));
	div.appendChild(label);
	div.appendChild(document.createElement("br"));
	div.appendChild(labelT);

	tareas.appendChild(div);

	setlocalstorage(tareaObj);

});

//Al momento de dar click en el boton se borra el elemento div que lo contiene y se borra la tarea a la que hace referencia en el localStorage.
function eliminar(boton){
	let id = boton.id;
	var elim = document.getElementById(id);
	var tareas = document.getElementById("tasks");
	if (elim.parentNode){
		divI = elim.parentNode;
		divI.removeChild(elim);
		tareas.removeChild(divI);
		delLocalStorage(id);

	}
}

//Función para agregar una tarea al localStorage.
function setlocalstorage(tareaObj){
	localStorage.setItem(tareaObj.nombre,JSON.stringify(tareaObj));
}

//Función para eliminar una tarea del localStorage.
function delLocalStorage(key){
	localStorage.removeItem(key);
}

//Función para volver a agregar las tareas a la pagina despues de volverla a cargar.
window.onload = function(){
	console.log("Se recargo la pagina");
	for (dato = 0; dato <localStorage.length; dato++){
		key = localStorage.key(dato);
		let tarea = JSON.parse(localStorage.getItem(key));
		console.log(tarea);
		var tareas = document.getElementById("tasks");
		var div = document.createElement("DIV");
		var ntarea = document.createElement("button");
		var label = document.createElement("LABEL");
		var labelT = document.createElement("LABEL");

		div.style.backgroundColor = tarea.col;
		div.setAttribute('class', 'etiquetaA');
		div.id = "id " + tarea.nombre; 

		ntarea.id = tarea.nombre;
		ntarea.setAttribute('class', 'tareaA');
		ntarea.setAttribute('onclick', 'eliminar(this)');
		ntarea.name = 'tarea';


		label.for = 'tarea';
		label.innerHTML = tarea.nombre; 

		tiempo = calcularTiempo(tarea.fech);
		labelT.id = "tiempo " + tarea.nombre;
		labelT.innerHTML =  tiempo.diasRestantes + "d: "+ tiempo.horasRestantes + "h: "+ tiempo.minutosRestantes + "m: " + tiempo.segundosRestantes + "s"; 

		div.appendChild(ntarea);
		div.appendChild(document.createElement("br"));
		div.appendChild(label);
		div.appendChild(document.createElement("br"));
		div.appendChild(labelT);

		tareas.appendChild(div);
	}
}


//Función que calcula el tiempo que falta para que tu tarea finalice.
const calcularTiempo = str => {

	lista = str.split("-");
	let actual = new Date(),
		tiempoRestante = ( new Date(lista[0],parseInt(lista[1])-1,lista[2],24,60,60) - new Date() + 1000) / 1000,
		segundosRestantes = ('0' + Math.floor(tiempoRestante % 60 )).slice(-2),
		minutosRestantes = ('0' + Math.floor(tiempoRestante / 60 % 60)).slice(-2),
		horasRestantes = ('0' + Math.floor(tiempoRestante / 3600 % 24)).slice(-2),
		diasRestantes = Math.floor(tiempoRestante / (3600 * 24));
	return {
		tiempoRestante,
		segundosRestantes,
		minutosRestantes,
		horasRestantes,
		diasRestantes
	}
};

//Función que se ejecuta cada segundo para actualizar el tiempo que falta para que finalice la tarea.
const timer = setInterval( () =>{
	for (dato = 0; dato <localStorage.length; dato++){
		key = localStorage.key(dato);
		let tarea = JSON.parse(localStorage.getItem(key));
		console.log(tarea);
		var label = document.getElementById("tiempo " + tarea.nombre);
		console.log(label);
		let tiempo = calcularTiempo(tarea.fech);
		label.innerHTML = tiempo.diasRestantes + "d: "+ tiempo.horasRestantes + "h: " + tiempo.minutosRestantes + "m: " + tiempo.segundosRestantes + "s"; 
		if (tiempo.tiempoRestante <= 1){
			var elim = document.getElementById("id "+ tarea.nombre);
			var tareas = document.getElementById("tasks");
			tareas.removeChild(elim);
			delLocalStorage(tarea.nombre);
		}
	}	
},1000);
