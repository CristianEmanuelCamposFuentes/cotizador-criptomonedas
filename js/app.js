const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');


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