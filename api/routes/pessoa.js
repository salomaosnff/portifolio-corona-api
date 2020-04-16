const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pessoa = require("../models/pessoa");

router.get("/logar", (req, res) => {
  Pessoa.find()
    .exec()
    .then((pessoas) => {
      let pessoa = {};
      pessoas.forEach((p) => {
        if (p.email == req.query.email && p.senha == req.query.senha)
          pessoa = p;
      });
      if (pessoa._id) res.status(200).json(pessoa);
      else res.status(404).json({});
    })
    .catch(() => {
      res.status(404).json({});
    });
});

router.get("/", (req, res, next) => {
  Pessoa.find()
    .sort({ nome: "asc" })
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:pessoaId", (req, res, next) => {
  Pessoa.findById(req.params.pessoaId)
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  const pessoa = new Pessoa({
    _id: new mongoose.Types.ObjectId(),
    nome: req.body.nome,
    email: req.body.email,
    telefone: req.body.telefone,
    cpf: req.body.cpf,
    cnpj: req.body.cnpj,
    tipo: req.body.tipo,
    senha: req.body.senha,
    colaborador: req.body.colaborador,
    investidor: req.body.investidor,
    cliente: req.body.cliente,
    whatsapp: req.body.whatsapp,
  });
  pessoa
    .save()
    .then(() => {
      res.status(201).json({ message: "Salvo com sucesso!", _id: pessoa._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:pessoaId", (req, res, next) => {
  Pessoa.update({ _id: req.params.pessoaId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!" }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:pessoaId", (req, res, next) => {
  Pessoa.remove({ _id: req.params.pessoaId })
    .exec()
    .then((x) => res.status(200).json({ message: "Deletado com sucesso!" }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
