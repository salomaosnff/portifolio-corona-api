const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Pessoa = require('../models/pessoa')

router.get('/', (req, res, next) => {
    Pessoa.find()
        .sort({ nome: 'asc' })
        .populate('endereco')
        .exec()
        .then(x => res.status(200).json(x))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/:pessoaId', (req, res, next) => {
    Pessoa.findById(req.params.pessoaId)
        .populate('endereco')
        .exec()
        .then(x => {
            if (x) res.status(200).json(x)
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.post('/', (req, res, next) => {
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
        endereco: req.body.endereco,
    })
    pessoa.save()
        .then(() => { res.status(201).json({ message: 'Salvo com sucesso!', _id: pessoa._id }) })
        .catch(err => res.status(500).json({ error: err }))
})

router.put('/:pessoaId', (req, res, next) => {
    Pessoa.update({ _id: req.params.pessoaId }, { $set: req.body }).exec()
        .then(x => res.status(200).json({ message: 'Editado com sucesso!' }))
        .catch(err => res.status(500).json({ error: err }))
})


router.delete('/:pessoaId', (req, res, next) => {
    Pessoa.remove({ _id: req.params.pessoaId }).exec()
        .then(x => res.status(200).json({ message: 'Deletado com sucesso!' }))
        .catch(err => res.status(500).json({ error: err }))
})

module.exports = router
