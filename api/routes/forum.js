const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Forum = require("../models/forum");

router.get("/", (req, res, next) => {
  Forum.find()
    .sort({ titulo: "asc" })
    .populate("responsavel")
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:forumId", (req, res, next) => {
  Forum.findById(req.params.forumId)
    .sort({ titulo: "asc" })
    .populate("responsavel")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  console.log(req.body);

  const forum = new Forum({
    _id: new mongoose.Types.ObjectId(),
    responsavel: req.body.responsavel,
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    link: req.body.link,
    status: false
  });

  forum
    .save()
    .then(() => {
      res.status(201).json({ message: "Salvo com sucesso!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:forumId", (req, res, next) => {
  Forum.update({ _id: req.params.forumId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!" }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:forumId", (req, res, next) => {
  Forum.remove({ _id: req.params.forumId })
    .exec()
    .then((x) => res.status(200).json({ message: "Deletado com sucesso!" }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
