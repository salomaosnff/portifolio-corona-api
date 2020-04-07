const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Solucao = require('../models/solucao')

router.get('/', (req, res, next) => {
    Solucao.find()
        .sort({ nome: 'asc' })
        .populate('responsavel')
        .populate('endereco')
        .exec()
        .then(x => res.status(200).json(x))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/:solucaoId', (req, res, next) => {
    Solucao.findById(req.params.solucaoId)
        .populate('responsavel')
        .populate('endereco')
        .exec()
        .then(x => {
            if (x) res.status(200).json(x)
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => res.status(500).json({ error: err }))
})


router.get('/busca/:buscar', (req, res, next) => {

    // http://localhost:3000/solucao/busca/buscar?query=Sua Busca
    var buscaParam = req.query.query
    
    Solucao.find({ $or: [ { nome: { $regex: buscaParam, $options:'i' }}, { tipo: { $regex: buscaParam }}, { status: { $regex: buscaParam }}, { area_aplicacao: { $regex: buscaParam }}, { negocio: { $regex: buscaParam }} ] } )
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
        responsavel: req.body.responsavel,
        nome: req.body.nome,
        tipo: req.body.tipo,
        instituicao: req.body.instituicao,
        inicio: req.body.inicio,
        fim: req.body.fim,
        descricao: req.body.descricao,
        status: req.body.status,
        link_web: req.body.link_web,
        link_youtube: req.body.link_youtube,
        endereco: req.body.endereco,
        area_aplicacao: req.body.area_aplicacao,
        negocio: req.body.negocio,
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
