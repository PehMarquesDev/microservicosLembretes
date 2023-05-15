// Require é a declaração de um módulo, diz que precisamos dele.
// Então o atribuimos a uma constante.
// O express é um módulo que simula um servidor HTTP
// Ele será quem vai receber os diferentes tipos de requisições HTTP
const express = require('express');

// Módulo axios, para receber e fazer requisições
const axios = require("axios");

// Módulo bodyparser, adicionará o campo body à requisição
// ajudará na extração do texto
const bodyParser = require('body-parser');
const app = express();

//Diz ao express para utilizar o bodyparser
//Assim, ele irá interpretar JSON
app.use(bodyParser.json());

// Dados serão armazenados em uma memória volátil, objeto JSON.
// Não serão gravados quando o servidor for encerrado
const lembretes = {};
contador = 0;

// Definição do método que fará a requisição GET
// Req de Request e Res de Response
app.get('/lembretes', (req, res) => {
    // Quando um Get for feito, ele retornará a coleção inteira de lembretes
    res.send(lembretes)
});

// Definição do método que fará a requisição PUT
// Requisição assíncrona
app.post('/lembretes', async (req, res) => {
    // Contador que irá gerar o Id de cada lembrete e irá passar pelos registros na memória
    contador++;

    //Constante texto, receberá o que estiver no body da Requisição marcado como 'texto', no json
    //O lembrete em si
    const { texto } = req.body;
    //Irá gravar o Id e o conteúdo do lembrete na memória, na posição em que o contador estiver
    lembretes[contador] = {
        contador, texto
    };

    // enfilera o post
    // Esse post será feito no index do barramento de eventos
    // Ele irá realizar um post e enviar o conteúdo para o serviço da porta 10000
    await axios.post("http://localhost:10000/eventos", {
        tipo: "LembreteCriado",
        dados: {
            contador,
            texto,
        },
    });

    //Retorna o status da requisição e lembrete que acabou de ser inserido
    //status 201 = Criado com sucesso
    res.status(201).send(lembretes[contador]);

});

// Post que será feito pelo axios do barramento, que retornará o evento enviado pelos outros serviços
// Ele recebe o evento e o escreve no console
app.post("/eventos", (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
});


app.listen(4000, () => {
    console.log('Lembretes. Porta 4000');
});

