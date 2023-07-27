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

router.put('/editar/:id', authUser, conectarBancoDados, async function(req, res) {
    try{
      // #swagger.tags = ['Tarefa']
      let idTarefa = req.params.id;
      let {posicao, titulo, descricao, status, dataEntrega} = req.body;
      const usuarioLogado = req.usuarioJwt.id;

      const checkTarefa = await EsquemaTarefa.findOne({_id: idTarefa, criador: usuarioLogado})        ;
      if(!checkTarefa){
        throw new Error("Tarefa não encontrada ou pertence a outro usuário");
      }

      const tarefaAtualizada = await EsquemaTarefa.updateOne({_id: idTarefa}, {posicao, titulo, descricao, status, dataEntrega});
      if (tarefaAtualizada?.modifiedCount > 0) {
        const dadosTarefa = await EsquemaTarefa.findOne({_id: idTarefa}).populate('criador');

        res.status(200).json({
            status: "OK",
            statusMensagem: "Tarefa atualizada com suceso.",
            resposta: dadosTarefa
          })
      }
  
    } catch (error) {
      return tratarErrosEsperados(res, error);
    }
  });

  router.get('/obter/usuario', authUser, conectarBancoDados, async function(req, res) {
    try{
      // #swagger.tags = ['Tarefa']
      // #swagger.description = "Endpoint para obter todas as tarefas do usuário logado."
      const usuarioLogado = req.usuarioJwt.id;
      const respostaBD = await EsquemaTarefa.find({criador: usuarioLogado}).populate('criador');
  
      res.status(200).json({
        status: "OK",
        statusMensagem: "Tarefas listadas na resposta com suceso.",
        resposta: respostaBD
      })
  
    } catch (error) {
      return tratarErrosEsperados(res, error);
    }
  });

  router.delete('/deletar/:id', authUser, conectarBancoDados, async function(req, res) {
    try{
      // #swagger.tags = ['Tarefa']
      const idTarefa = req.params.id;
      const usuarioLogado = req.usuarioJwt.id;

      const checkTarefa = await EsquemaTarefa.findOne({_id: idTarefa, criador: usuarioLogado})        ;
      if(!checkTarefa){
        throw new Error("Tarefa não encontrada ou pertence a outro usuário");
      }

      const respostaBD = await EsquemaTarefa.deleteOne({_id: idTarefa});
  
      res.status(200).json({
        status: "OK",
        statusMensagem: "Tarefa deletada com suceso.",
        resposta: respostaBD
      })
  
    } catch (error) {
      return tratarErrosEsperados(res, error);
    }
  });

module.exports = router;
