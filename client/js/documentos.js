// Variables -------------------------------------------------
let btnAgregar = document.querySelector("#btnAgregar");
btnAgregar.addEventListener("click", agregar);
let btnGetAutorPopular = document.querySelector("#btnGetAutorPopular");
btnGetAutorPopular.addEventListener("click", getAutorPopular);
let btnGetTemaPopular = document.querySelector("#btnGetTemaPopular");
btnGetTemaPopular.addEventListener("click", getTemaPopular);
let btnGetTituloModerno = document.querySelector("#btnGetTituloModerno");
btnGetTituloModerno.addEventListener("click", getTituloModerno);
let resultDiv = document.querySelector("#result");
let documentos = []; 

// Main ------------------------------------------------------
load();

// Methods ---------------------------------------------------

async function load() {
  let response = await fetch("./data/documentos.json");
  let json = await response.json();
  documentos = json.documentos;
  mostrarTablaDocumentos();
}

function agregar() {
  let alertContainer = document.querySelector('#alert');
  let alert = `<div class="alert alert-danger alert-dismissible" role="alert">
    Debe completar todos los campos para agregar un documento.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
  </div>`;
  let titulo = document.querySelector('#titulo');
  let autor = document.querySelector('#autor');
  let temas = document.querySelector('#temas');
  let fecha = document.querySelector('#fecha');
  let tituloVal = titulo.value;
  let autorVal = autor.value;
  let temasVal = temas.value;
  let fechaVal = fecha.value;

  if (tituloVal && autorVal && temasVal && fechaVal) {
    console.log("Agregando...");
    alertContainer.innerHTML = ""; 
    let renglon = {
      "titulo": tituloVal,
      "autor": autorVal,
      "temas": temasToArreglo(temasVal),
      "fecha": fechaVal
    }
    titulo.value = "";
    autor.value = "";
    temas.value = "";
    fecha.value = "";
    documentos.push(renglon);
    mostrarTablaDocumentos();
  } else {
    alertContainer.innerHTML = alert;
  }
}

function mostrarTablaDocumentos() {
  let html = "";
  for (let r of documentos) {
    html += `
    <tr>
    <td>${r.titulo}</td>
    <td>${r.autor}</td>
    <td>${r.temas}</td>
    <td>${r.fecha}</td>
    </tr>
    `;
  }
  document.querySelector("#tblDocumentos").innerHTML = html;
  console.log(documentos);
}

function temasToArreglo(temas){
    var temaArreglo = temas.split(',');
    temaArreglo = temaArreglo.map(function(tema) {
      return tema.replace('\r', '');
    });
    return temaArreglo;
}

function getAutorPopular(){
    resultDiv.innerHTML = "";
    let max = 0;
    let autorPopular = "";
    for (let i = 0; i < documentos.length; i++) {
        const element = documentos[i];
        const cantidad = contarDocumentosPorAutor(element.autor);
        if ( cantidad > max) {
            max = cantidad;
            autorPopular = element.autor;
        }
    }
    resultDiv.innerHTML = "El autor con mas documentos es '"+ autorPopular+ "', con "+ max+ " documentos.";
}


function getTemaPopular(){
    resultDiv.innerHTML = "";
    let max = 0;
    let temaPopular = "";
    
    for (let i = 0; i < documentos.length; i++) {
        const element = documentos[i];
        element.temas.forEach(elementTema => {            
            const cantidad = contarDocumentosPorTema(elementTema);
            if ( cantidad > max) {
                max = cantidad;
                temaPopular = elementTema;
            }
        });        
    }
    resultDiv.innerHTML = "El Tema mas repetido es '"+ temaPopular+ "', con apariciones en "+ max+ " documentos.";
}

function getTituloModerno(){
    resultDiv.innerHTML = "";
    let max = "0000-00-00";
    let tituloModerno = "";
    
    for (let i = 0; i < documentos.length; i++) {
        const element = documentos[i];
        const estaFecha = element.fecha;
        if ( estaFecha > max) {
            max = estaFecha;
            tituloModerno = element.titulo;
        }
    }

    resultDiv.innerHTML = "El Titulo mas moderno es '"+ tituloModerno+ "', con apariciones en "+ max+ " documentos.";
}



// Private Methods ---------------------------------------------------
function contarDocumentosPorAutor(autor){
    var contador = 0;
    for (let i = 0; i < documentos.length; i++) {
        const element = documentos[i];
        if (element.autor === autor) {
            contador++;
        }        
    }
    return contador;
}

function contarDocumentosPorTema(tema){
    var contador = 0;
    for (let i = 0; i < documentos.length; i++) {
        const element = documentos[i];
        element.temas.forEach(elementTema => {            
            if (elementTema === tema) {
                contador++;
            }        
        });
    }
    return contador;
}