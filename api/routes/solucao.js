const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const Solucao = require("../models/solucao");

get_externo_ifce = async () => {
  return axios
    .get("http://prpi.ifce.edu.br/nl/acoescovidws/?num=100000")
    .then((docs) => {
      let solucoes = [],
        solucao = {};
      docs.data.posts.forEach((element) => {
        solucao = {
          nome: element.row.NomeDaAcao,
          tipo: element.row.TipoDeAcao,
          responsavel: element.row.Responsavel,
          instituicao: element.row.Instituicao,
          descricao: element.row.MaisInformacoes,
          status: element.row.StatusAcao,
          link_web: element.row.LinkWeb,
          link_youtube: element.row.LinkYoutube,
          base: "prpi.ifce.edu.br",
        };
        solucoes.push(solucao);
      });
      return solucoes;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};

router.get("/", (req, res, next) => {
  Solucao.find()
    .sort({ nome: "asc" })
    .populate("responsavel")
    .populate("cidade")
    .exec()
    .then(async (x) => {
      x = x.concat(await get_externo_ifce());
      res.status(200).json(x);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/buscarPorPessoa", (req, res) => {
  Solucao.find()
    .sort({ nome: "asc" })
    .populate("responsavel")
    .populate("cidade")
    .exec()
    .then(solucoes => {
      let solucoes_por_pessoa = [];
      solucoes.forEach(solucao => {
        if (solucao.responsavel._id == req.query.pessoaId)
          solucoes_por_pessoa.push(solucao);
      });
      if (solucoes_por_pessoa[0]) res.status(200).json(solucoes_por_pessoa);
      else res.status(404).json([]);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

removeAcento = (text) => {
  text = text.toLowerCase();
  text = text.replace(new RegExp("[ÁÀÂÃ]", "gi"), "a");
  text = text.replace(new RegExp("[ÉÈÊ]", "gi"), "e");
  text = text.replace(new RegExp("[ÍÌÎ]", "gi"), "i");
  text = text.replace(new RegExp("[ÓÒÔÕ]", "gi"), "o");
  text = text.replace(new RegExp("[ÚÙÛ]", "gi"), "u");
  text = text.replace(new RegExp("[Ç]", "gi"), "c");
  return text;
}


// Paginação
//http://localhost:3000/solucao/pagina/2&3
router.get('/pagina/:page&:limit', (req, res, next) => {
  
  var page = parseInt(req.params.page) || 1
  var limit = parseInt(req.params.limit) || 10
  
Solucao.find({})
     .skip((page * limit) - limit)
     .limit(limit)
     .sort({ nome: "asc" })
     .populate("responsavel")
     .exec()
     .then((x) => {
       if (x) res.status(200).json(x);
       else res.status(404).json({ message: "Registro não encontrado!" });
     })
     .catch((err) => res.status(500).json({ error: err }));
 });

router.get("/busca/:busca&:page&:limit", (req, res, next) => {
  req.params.busca = JSON.parse(req.params.busca);
  var page = parseInt(req.params.page) || 1
  var limit = parseInt(req.params.limit) || 10

  Solucao.find()
    .skip((page * limit) - limit)
    .limit(limit)
    .sort({ nome: "asc" })
    .populate("responsavel")
    .populate("cidade")
    .exec()
    .then(async (solucoes) => {
      solucoes = solucoes.concat(await get_externo_ifce());

      if (req.params.busca.status && req.params.busca.status != "")
        solucoes =
          (await solucoes.filter(
            (obj) =>
              obj.status &&
              removeAcento(obj.status).includes(
                removeAcento(req.params.busca.status)
              )
          )) || [];

      if (
        req.params.busca.area_aplicacao &&
        req.params.busca.area_aplicacao != ""
      )
        solucoes =
          (await solucoes.filter(
            (obj) =>
              obj.area_aplicacao &&
              removeAcento(obj.area_aplicacao).includes(
                removeAcento(req.params.busca.area_aplicacao)
              )
          )) || [];

      if (
        req.params.busca.negocio &&
        req.params.busca.negocio != ""
      )
        solucoes =
          (await solucoes.filter(
            (obj) =>
              obj.negocio &&
              removeAcento(obj.negocio).includes(
                removeAcento(req.params.busca.negocio)
              )
          )) || [];

      if (req.params.busca.busca && req.params.busca.busca != "")
        solucoes =
          (await solucoes.filter(
            (obj) =>
              (obj.nome &&
                removeAcento(obj.nome).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.tipo &&
                removeAcento(obj.tipo).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.status &&
                removeAcento(obj.status).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.area_aplicacao &&
                removeAcento(obj.area_aplicacao).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.negocio &&
                removeAcento(obj.negocio).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.cidade && obj.cidade.nome &&
                removeAcento(obj.cidade.nome).includes(
                  removeAcento(req.params.busca.busca)
                ))
          )) || [];

      res.status(200).json({ solucoes });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/:solucaoId", (req, res, next) => {
  Solucao.findById(req.params.solucaoId)
    .populate("responsavel")
    .populate("cidade")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/cont/cont/", (req, res, next) => {
    Solucao.find().countDocuments(function(err, count){
        if (count) res.status(200).json(count);
        else res.status(404).json({ message: "Registro não encontrado!" });
      })
      .catch((err) => res.status(500).json({ error: err }));
  });

router.post("/", (req, res, next) => {
  const solucao = new Solucao({
    _id: new mongoose.Types.ObjectId(),
    responsavel: req.body.responsavel,
    nome: req.body.nome,
    tipo: req.body.tipo,
    instituicao: req.body.instituicao,
    descricao: req.body.descricao,
    status: req.body.status,
    link_web: req.body.link_web,
    link_youtube: req.body.link_youtube,
    area_aplicacao: req.body.area_aplicacao,
    negocio: req.body.negocio,
    cidade: req.body.cidade,
    // en_nome: req.body.en_nome,
    // en_descricao: req.body.en_descricao,
  });
  solucao
    .save()
    .then(() => {
      res.status(201).json({ message: "Salvo com sucesso!", _id: solucao._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:solucaoId", (req, res, next) => {
  Solucao.update({ _id: req.params.solucaoId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!", _id: req.params.solucaoId }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:solucaoId", (req, res, next) => {
  Solucao.remove({ _id: req.params.solucaoId })
    .exec()
    .then((x) => res.status(200).json({ message: "Excluído com sucesso!", _id: req.params.solucaoId }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
