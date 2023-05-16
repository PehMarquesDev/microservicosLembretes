const express = require('express');
const bodyParser = require('body-parser');

//para enviar eventos para os demais microsserviços
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const eventos = []

// Esse post irá enviar o evento como conteúdo para os serviços presentes
// Ele recebe o evento que foi enviado por algum dos outros serviços
app.post('/eventos', async (req, res) => {
    const evento = req.body;
    eventos.push(evento)
    //console.log(req.body);
    try {
        //envia o evento para o microsserviço de lembretes
        await axios.post('http://localhost:4000/eventos', evento);
        //envia o evento para o microsserviço de observações
        await axios.post('http://localhost:5000/eventos', evento);
        //envia o evento para o microsserviço de consulta
        await axios.post("http://localhost:6000/eventos", evento);
        //envia o evento para o microsservico de classificacao
        await axios.post("http://localhost:7000/eventos", evento);
    }
    catch (error) {
        console.log("O serviço de Classificação está indisponível")
    }
    res.status(200).send({ msg: "ok" });
});

app.get('/eventos', (req, res) => {
    res.send(eventos)
})


app.listen(10000, () => {
    console.log('Barramento de eventos. Porta 10000.')
})