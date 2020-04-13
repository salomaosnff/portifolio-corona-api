const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const axios = require('axios')
const Solucao = require('../models/solucao')

get_externo_ifce = async () => {
    return axios.get('http://prpi.ifce.edu.br/nl/acoescovidws')
        .then(docs => {
            let solucoes = [], solucao = {}
            docs.data.posts.forEach(element => {
                solucao = {
                    nome: element.row.NomeDaAcao,
                    tipo: element.row.TipoDeAcao,
                    responsavel: element.row.Responsavel,
                    instituicao: element.row.Instituicao,
                    descricao: element.row.MaisInformacoes,
                    status: element.row.StatusAcao,
                    link_web: element.row.LinkWeb,
                    link_youtube: element.row.LinkYoutube,
                    base: 'prpi.ifce.edu.br'
                }
                solucoes.push(solucao)
            })
            return solucoes
        })
        .catch(err => {
            console.error(err);
            return []
        })
}

router.get('/', (req, res, next) => {
    Solucao.find()
        .sort({ nome: 'asc' })
        .populate('responsavel')
        .populate('palavra_chave')
        .exec()
        .then(async x => {
            //Integrando Busca com Bases Externas (abaixo)
            x = x.concat(await get_externo_ifce())
            //Integrando Busca com Bases Externas (acima)
            res.status(200).json(x)
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/:solucaoId', (req, res, next) => {
    Solucao.findById(req.params.solucaoId)
        .populate('responsavel')
        .populate('palavra_chave')
        .exec()
        .then(x => {
            if (x) res.status(200).json(x)
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/busca/:busca', (req, res, next) => {
    req.params.busca = JSON.parse(req.params.busca)
    Solucao.find()
        .sort({ nome: 'asc' })
        .exec()
        .then(async (solucoes) => {

            solucoes = solucoes.concat(await get_externo_ifce())

            if (req.params.busca.status && req.params.busca.status != '') solucoes = await solucoes.filter((obj) =>
                obj.status && obj.status.toLowerCase().includes(req.params.busca.status.toLowerCase())
            ) || []

            if (req.params.busca.area_aplicacao && req.params.busca.area_aplicacao != '') solucoes = await solucoes.filter((obj) =>
                obj.area_aplicacao && obj.area_aplicacao.toLowerCase().includes(req.params.busca.area_aplicacao.toLowerCase())
            ) || []

            if (req.params.busca.busca && req.params.busca.busca != '') solucoes = await solucoes.filter((obj) =>
                obj.nome && obj.nome.toLowerCase().includes(req.params.busca.busca.toLowerCase()) ||
                obj.tipo && obj.tipo.toLowerCase().includes(req.params.busca.busca.toLowerCase()) ||
                obj.status && obj.status.toLowerCase().includes(req.params.busca.busca.toLowerCase()) ||
                obj.area_aplicacao && obj.area_aplicacao.toLowerCase().includes(req.params.busca.busca.toLowerCase()) ||
                obj.negocio && obj.negocio.toLowerCase().includes(req.params.busca.busca.toLowerCase())
            ) || []

            res.status(200).json({ solucoes })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})

router.post('/', (req, res, next) => {
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
        area_aplicacao: req.body.area_aplicacao,
        negocio: req.body.negocio,
        palavra_chave: req.body.palavra_chave,
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