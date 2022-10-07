const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}


// Crear un Promise, definir una funcion como function expression
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});


document.addEventListener('DOMContentLoaded', ()=>{
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => obtenerCriptomonedas(resultado.Data)) // En vez de crear un callback, se crea un promise para seguir trabajando y extender la funcionalidad
        .then( criptomonedas => selectCriptomonedas(criptomonedas))
        // .then( criptomonedas => console.log(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    // Como va a ser un array, se busca recorrerlo
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;

}

function submitFormulario(e) {
    e.preventDefault();

    // Validar 
    const { moneda, criptomoneda } = objBusqueda;

    if( moneda === '' || criptomoneda === '' ){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(msg){
    const existeError = document.querySelector('.error');

    if (!existeError) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');

        //Mensaje de error
        divMensaje.textContent = msg;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    
}

function consultarAPI(){
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]))
}

function mostrarCotizacion(cotizacion) {

    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El precio mas alto del dia es de: ${HIGHDAY}`;
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El precio mas bajo del dia es de: ${LOWDAY}`;

    const cambioDia = document.createElement('p');
    cambioDia.innerHTML = `El cambio porcentual del dia es de: ${CHANGEPCT24HOUR} %`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `La ultima actualizacion es: ${LASTUPDATE}`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(cambioDia);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
    while (resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `

    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>

    `

    resultado.appendChild(spinner);
    
}