const api_url = 'https://mindicador.cl/api/';

async function obtenerTasaCambio() {
    try {
        const montoPesos = document.getElementById('montoInput').value;
        const optionSelected = document.getElementById('select_coin').value;

        if (!montoPesos || !optionSelected) {
            alert('Ingrese monto');
            return;
        }

        const urlApi = `https://mindicador.cl/api/${optionSelected}`;
        const response = await fetch(urlApi);
        const data = await response.json();

        const resultado = montoPesos * data.serie[0].valor;

        const resultadoTexto = document.getElementById('resultadoTexto');
        resultadoTexto.textContent = `resultado: ${resultado.toFixed(2)} ${data.nombre}`;

    } catch (error) {
        console.error('Error al obtener la tasa de cambio:', error);
    }
}

async function getCoins(url) {
    try {
        const monedas = await fetch(url);
        const { monedas: coins } = await monedas.json();
        return coins;
    } catch (error) {
        throw new Error(error);
    }
}

async function renderCoinOptions(url) {
    try {
        const selectContainer = document.getElementById('select_coin');
        const coins = await getCoins(url);

        coins.forEach((coin_info) => {
            const option = document.createElement('option');
            option.value = coin_info.codigo;
            option.innerText = coin_info.nombre;

            selectContainer.appendChild(option);
        });
    } catch (error) {
        throw new Error(error);
    }
}

async function renderGrafica() {
    const optionSelected = document.getElementById('select_coin').value;

    if (!optionSelected) {
        alert('Seleccione una moneda');
        return;
    }

    const data = await getAndCreateDataToChart(api_url, optionSelected);
    const config = {
        type: 'line',
        data,
    };

    const canvas = document.getElementById('chart');
    canvas.style.backgroundColor = 'white';
    new Chart(canvas, config);
}

function start() {
    renderCoinOptions(api_url);

    document.getElementById('search').addEventListener('click', () => {
        obtenerTasaCambio();
        renderGrafica();
    });
}

start();


document.getElementById('search').addEventListener('click', obtenerTasaCambio);
async function getCoins(url) {
    try {
        const monedas = await fetch(url);
        const { dolar, ivp, euro, uf, utm } = await monedas.json();
        return [dolar, ivp, euro, uf, utm];
    } catch (error) {
        throw new Error(error);
    }
}

async function renderCoinOptions(url) {
    try {
        const select_container = document.getElementById('select_coin');
        const coins = await getCoins(url);

        coins.forEach((coin_info) => {
            const option = document.createElement('option');
            option.value = coin_info['codigo'];
            option.innerText = coin_info['nombre'];

            select_container.appendChild(option);

            console.log(coin_info);
        });
    } catch (error) {
        throw new Error(error);
    }
}

async function getCoinDetails(url, coinID) {
    try {
        if (coinID) {
            const coin = await fetch(`${url}${coinID}`);
            const { serie } = await coin.json();
            const [{ valor: coinValue }] = serie;

            return coinValue;
        } else {
            alert('Seleciona una moneda');
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function getAndCreateDataToChart(url, coinID) {
    const coin = await fetch(`${url}${coinID}`);
    const { serie } = await coin.json();

    const labels = serie.map(({ fecha }) => {
        return fecha;
    });
    const data = serie.map(({ valor }) => {
        return valor;
    });

    const datasets = [
        {
            label: 'Precio ultimos dias',
            borderColor: 'rgb(255, 99, 132)',
            data,
        },
    ];

    return { labels, datasets };
}

async function renderGrafica() {
    const option_selected = document.getElementById('select_coin').value;

    const data = await getAndCreateDataToChart(api_url, option_selected);
    console.log(data);
    const config = {
        type: 'line',
        data,
    };

    const canvas = document.getElementById('chart');
    canvas.style.backgroundColor = 'white';
    myChart = new Chart(canvas, config);
}

