const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Solucao = require('../models/solucao')

router.get('/', (req, res, next) => {
    Solucao.find()
        .sort({ nome: 'asc' })
        .populate('pessoa')
        .populate('endereco')
        .exec()
        .then(x => res.status(200).json(x))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/:pessoaId', (req, res, next) => {
    Solucao.findById(req.params.solucaoId)
        .populate('pessoa')
        .populate('endereco')
        .exec()
        .then(x => {
            if (x) res.status(200).json(x)
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => res.status(500).json({ error: err }))
})
router.post('/', (req, res, next) => {
    console.log(req.body)

    const solucao = new Solucao({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        tipo: req.body.tipo,
        responsavel: req.body.responsavel,
        instituicao: req.body.instituicao,
        inicio: req.body.inicio,
        fim: req.body.fim,
        cidade: req.body.cidade,
        estado: req.body.estado,
        pais: req.body.pais,
        telefone: req.body.telefone,
        email: req.body.email,
        link_web: req.body.link_web,
        link_youtube: req.body.link_youtube,
        mais_informacoes: req.body.mais_informacoes,
        status: req.body.status,
        pessoa: req.body.pessoa,
    })
    solucao.save()
        .then(() => { res.status(201).json({ message: 'Salvo com sucesso!' }) })
        .catch(err => res.status(500).json({ error: err }))
})

router.put('/:solucaoId', (req, res, next) => {
    Solucao.update({ _id: req.params.solucaoId }, { $set: req.body }).exec()
        .then(x => res.status(200).json({ message: 'Editado com sucesso!' }))
        .catch(err => res.status(500).json({ error: err }))
})


router.delete('/:solucaoId', (req, res, next) => {
    Solucao.remove({ _id: req.params.solucaoId }).exec()
        .then(x => res.status(200).json({ message: 'Deletado com sucesso!' }))
        .catch(err => res.status(500).json({ error: err }))
})

module.exports = router
