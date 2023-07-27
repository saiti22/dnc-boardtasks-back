const express = require('express');
const conectarBancoDados = require('../middlewares/conectarBD');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const EsquemaTarefa = require('../models/tarefa');
const authUser = require('../middlewares/authUser');
const router = express.Router();


router.post('/criar', authUser, conectarBancoDados, async function(req, res) {
  try{
    // #swagger.tags = ['Tarefa']
    let {posicao, titulo, descricao, status, dataEntrega} = req.body;
    const criador = req.usuarioJwt.id;
    const respostaBD = await EsquemaTarefa.create({posicao, titulo, descricao, status, dataEntrega, criador});

    res.status(200).json({
      status: "OK",
      statusMensagem: "Tarefa criada com suceso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

module.exports = router;
