const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cidade = require('../models/cidade');
const Estado = require('../models/estado')

router.post('/cadastrarCidades', (req, res) => {
    req.body.estados.forEach(element => {
        Estado.find({ nome: element.nome }, function (err, arr) {
            var estadoX;
            arr.forEach(estado => {
                estadoX = estado._id
            })
            element.cidades.forEach(cid => {
                const cidade = new Cidade({
                    _id: new mongoose.Types.ObjectId(),
                    estado: estadoX,
                    nome: cid,
                })
                cidade.save()
                    .then(() => { res.status(201).json({ message: 'Salvo com sucesso!' }) })
                    .catch(err => res.status(500).json({ error: err }))
            })
        })
    })
})

router.get('/', (req, res) => {
    Cidade.find()
        .sort({ nome: 'asc' })
        .populate('estado')
        .exec()
        .then(x => res.status(200).json(x))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/:cidadeId', (req, res) => {
    Cidade.findById(req.params.cidadeId)
        .populate('estado')
        .exec()
        .then(x => {
            if (x) res.status(200).json(x)
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/estado/:estadoId', (req, res) => {
    Cidade.find()
        .exec()
        .then(async (docs) => {
            let cidades = docs.filter((obj) => obj.estado == req.params.estadoId)
            res.status(200).json({ cidades })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})

router.put('/:cidadeId', (req, res) => {
    Cidade.update({ _id: req.params.cidadeId }, { $set: req.body }).exec()
        .then(x => res.status(200).json({ message: 'Editado com sucesso!' }))
        .catch(err => res.status(500).json({ error: err }))
})

router.delete('/:cidadeId', (req, res, next) => {
    Cidade.remove({ _id: req.params.cidadeId }).exec()
        .then(x => res.status(200).json({ message: 'Deletado com sucesso!' }))
        .catch(err => res.status(500).json({ error: err }))
})

module.exports = router;