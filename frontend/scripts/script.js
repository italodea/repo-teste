function criarConta() {

    var criarConta = document.getElementById('criarConta').value;
    var criarTipo = document.getElementById("criarTipo").value;
    var saldoInicial = document.getElementById('saldoInicial').value;
    if (criarConta != "") {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": criarConta,
            "type": criarTipo,
            "balance": saldoInicial
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'error'
        };

        fetch("http://localhost:3000/account/create", requestOptions)
            .then(response => response.text())
            .then(result => document.getElementById('criarResposta').innerHTML = result)
            .catch(error => console.log('error', error));
    }
}


function consultarConta() {
    var consultarConta = document.getElementById('consultarConta').value
    if (consultarConta != "") {
        var requestOptions = {
            method: 'GET',
            redirect: 'error'
        };

        fetch("http://localhost:3000/account/balance/" + consultarConta, requestOptions)
            .then(response => response.text())
            .then(result => document.getElementById('consultarResposta').innerHTML = result)
            .catch(error => console.log('error', error));
    }
}
function creditarConta() {
    var creditarConta = document.getElementById("creditarConta").value;
    var creditarValor = document.getElementById("creditarValor").value;
    if (creditarConta != "" && creditarValor != "") {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": creditarConta,
            "value": creditarValor
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'error'
        };

        fetch("http://localhost:3000/account/credit/", requestOptions)
            .then(response => response.text())
            .then(result => document.getElementById('creditarResposta').innerHTML = result)
            .catch(error => console.log('error', error));


    }
}
function debitarConta() {
    var debitarConta = document.getElementById("debitarConta").value;
    var debitarValor = document.getElementById("debitarValor").value;
    if (debitarConta != "" && debitarValor != "") {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": debitarConta,
            "value": debitarValor
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'error'
        };

        fetch("http://localhost:3000/account/debit/", requestOptions)
            .then(response => response.text())
            .then(result => document.getElementById('debitarResposta').innerHTML = result)
            .catch(error => console.log('error', error));
    }
}

function transferirValor() {
    var transferirOrigem = document.getElementById("transferirOrigem").value;
    var transferirDestino = document.getElementById("transferirDestino").value;
    var transferirValor = document.getElementById("transferirValor").value;
    if (transferirOrigem != "" && transferirDestino != "" && transferirValor != "") {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "originId": transferirOrigem,
            "destinationId": transferirDestino,
            "value": transferirValor
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'error'
        };

        fetch("http://localhost:3000/account/transfer/", requestOptions)
            .then(response => response.text())
            .then(result => document.getElementById('transferirResposta').innerHTML = result)
            .catch(error => console.log('error', error));
    }
}
function openPopup(id) {
    var popup = document.getElementById(id);
    popup.style.display = "block";
}

function closePopup(id) {
    var popup = document.getElementById(id);
    popup.style.display = "none";
    document.getElementById('transferirResposta').innerHTML = "";
    document.getElementById('debitarResposta').innerHTML = "";
    document.getElementById('creditarResposta').innerHTML = "";
    document.getElementById('consultarResposta').innerHTML = "";
    document.getElementById('criarResposta').innerHTML = "";
}

function renderJuros() {
    var renderConta = document.getElementById("renderConta").value;
    var renderTaxa = document.getElementById("renderTaxa").value;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "id": renderConta,
        "interestRate": renderTaxa
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/account/yieldInterest/", requestOptions)
        .then(response => response.text())
        .then(result => result => document.getElementById('renderResposta').innerHTML = result)
        .catch(error => console.log('error', error));
}

function exibirInput() {
    var select = document.getElementById('criarTipo').value;
    var input = document.getElementById('criarContaPoupanca');
    if (select == "Poupanca" || select == "Simples") {
        input.style = 'display:block'; // Exibe o campo de input
    } else {
        input.style = 'display:none'; // Oculta o campo de input
    }
}