const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const Noticias = require("../models/noticias");


router.get("/", (req, res, next) => {
  Noticias.find()
    .sort({ titulo: "asc" })
    .populate("responsavel")
    .populate("palavra_chave")
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/buscarPorPessoa", (req, res) => {
  Noticias.find()
    .sort({ titulo: "asc" })
    .populate("responsavel")
    .populate("palavra_chave")
    .exec()
    .then(noticias => {
      let noticias_por_pessoa = [];
      noticias.forEach(noticias => {
        if (noticias.responsavel._id == req.query.pessoaId)
          noticias_por_pessoa.push(noticias);
      });
      if (noticias_por_pessoa[0]) res.status(200).json(noticias_por_pessoa);
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

router.get("/busca/:busca", (req, res, next) => {
  req.params.busca = JSON.parse(req.params.busca);
  Noticias.find()
    .sort({ titulo: "asc" })
    .populate("responsavel")
    .populate("palavra_chave")
    .exec()
    .then(async (noticias) => {

      if (req.params.busca.titulo && req.params.busca.titulo != "")
        noticias =
          (await noticias.filter(
            (obj) =>
              obj.status &&
              removeAcento(obj.titulo).includes(
                removeAcento(req.params.busca.titulo)
              )
          )) || [];

      if (
        req.params.busca.subtitulo &&
        req.params.busca.subtitulo != ""
      )
        noticias =
          (await noticias.filter(
            (obj) =>
              obj.subtitulo &&
              removeAcento(obj.subtitulo).includes(
                removeAcento(req.params.busca.subtitulo)
              )
          )) || [];

      if (
        req.params.busca.descricao &&
        req.params.busca.descricao != ""
      )
        noticias =
          (await noticias.filter(
            (obj) =>
              obj.negocio &&
              removeAcento(obj.descricao).includes(
                removeAcento(req.params.busca.descricao)
              )
          )) || [];

      if (req.params.busca.busca && req.params.busca.busca != "")
        noticias =
          (await noticias.filter(
            (obj) =>
              (obj.titulo &&
                removeAcento(obj.titulo).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.subtitulo &&
                removeAcento(obj.subtitulo).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.descricao &&
                removeAcento(obj.descricao).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.palavra_chave &&
                removeAcento(obj.palavra_chave).includes(
                  removeAcento(req.params.busca.busca)

                ))
          )) || [];

      res.status(200).json({ noticias });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get('/pagina/:page&:limit', (req, res, next) => {
  
  var page = parseInt(req.params.page) || 1
  var limit = parseInt(req.params.limit) || 10
  
Noticias.find({})
     .skip((page * limit) - limit)
     .limit(limit)
     populate("responsavel")
    .populate("palavra_chave")
     .exec()
     .then((x) => {
       if (x) res.status(200).json(x);
       else res.status(404).json({ message: "Registro não encontrado!" });
     })
     .catch((err) => res.status(500).json({ error: err }));
 });

router.get("/:noticiaId", (req, res, next) => {
  Noticias.findById(req.params.noticiaId)
    .populate("responsavel")
    .populate("palavra_chave")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  const noticias = new Noticias({
    _id: new mongoose.Types.ObjectId(),
    titulo: req.body.titulo,
    subtitulo: req.body.subtitulo,
    data_publicacao: req.body.data_publicacao,
    data_atualizacao: req.body.data_atualizacao,
    descricao: req.body.descricao,
    responsavel: req.body.responsavel,
    palavra_chave: req.body.palavra_chave,
    // en_titulo: req.body.en_titulo,
    // en_subtitulo: req.body.en_subtitulo,
    // en_descricao: req.body.en_descricao,
  });

  noticias
    .save()
    .then(() => {
      res.status(201).json({ message: "Salvo com sucesso!", _id: noticias._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:noticiaId", (req, res, next) => {
  Noticias.update({ _id: req.params.noticiaId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!" }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:noticiaId", (req, res, next) => {
  Noticias.remove({ _id: req.params.noticiaId })
    .exec()
    .then((x) => res.status(200).json({ message: "Deletado com sucesso!" }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
