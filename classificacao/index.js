const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
const palavraChave = "importante";

const funcoes = {
    ObservacaoCriada: (observacao) => {
        observacao.status =
            observacao.texto.includes(palavraChave)
                //Includes é semelhante ao .Contains do C#
                ? "importante" || "Importante"
                : "comum";
        axios.post("http://localhost:10000/eventos", {
            tipo: "ObeservacaoClassificada",
            dados: observacao
        });
    }
}
app.post('/eventos', (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    }
    catch (err) {
        res.status(200).send({ msg: "ok" });
    }
});

app.listen(7000, () =>
    console.log("Classificação. Porta 7000"));