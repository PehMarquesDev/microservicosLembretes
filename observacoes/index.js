const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

//Declara o módulo UUID, pra gerar IDs únicos
const { v4: uuidv4 } = require('uuid');
// Dados serão armazenados em uma memória volátil, objeto JSON.
// Um lembrete da coleção de lembretes, pode ter uma coleção de várias observações
const observacoesPorLembreteId = {};

//:id é um placeholder
//exemplo: /lembretes/123456/observacoes
//:id - variável que será passada na URL. Nesse caso, é o Id do lembrete em questão

// função que irá inserir a observação no lembrete
app.put('/lembretes/:id/observacoes', async (req, res) => {
    const idObs = uuidv4();
    const { texto } = req.body;

    //Declaração de uma nova array com as observações já existentes
    const observacoesDoLembrete =
        //req.params dá acesso à lista de parâmetros da URL
        //Nesse caso, pega o valor do id que está na URL ":id"
        //Caso ele ache a lista com o parâmetro informado, ele irá retorná-la
        //Caso não, retorna uma lista vazia
        observacoesPorLembreteId[req.params.id] || [];
    // Push adiciona itens à nova coleção. Id + texto
    observacoesDoLembrete.push({ id: idObs, texto });
    //Substitui a coleção antiga pela que contém a nova observação
    observacoesPorLembreteId[req.params.id] =
        observacoesDoLembrete;
    await axios.post('http://localhost:10000/eventos', {
        tipo: "ObservacaoCriada",
        dados: {
            id: idObs, texto, lembreteId: req.params.id
        }
    });

    res.status(201).send(observacoesDoLembrete);
});

// função que consultar a observação no lembrete
app.get('/lembretes/:id/observacoes', (req, res) => {
    res.send(observacoesPorLembreteId[req.params.id] || []);
});

app.post("/eventos", (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
});

app.listen(5000, (() => {
    // é necessário utilizar uma porta diferente.
    //Assim os dois microsserviços poderão ser mantidos em execução simultaneamente.
    console.log('Observacoes. Porta 5000');
}));