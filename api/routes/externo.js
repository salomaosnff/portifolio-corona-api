const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const axios = require('axios');
const Solucao = require('../models/solucao')
const Pessoa = require('../models/pessoa')

router.get('/baixarDados', (req, res) => {
    const init = async() => {
        try{
            const dataex = await axios.get('http://prpi.ifce.edu.br/nl/acoescovidws');
            dataex.data.posts.forEach(element => {
        
                Pessoa.find({nome: element.row.Responsavel}, function(err, arr){
                    var respId;
                    arr.forEach(nomeDoResp => {
                        respId = nomeDoResp._id;
                    })
                    const solucao = new Solucao({
                        _id: new mongoose.Types.ObjectId(),
                        nome: element.row.NomeDaAcao,
                        tipo: element.row.TipoDeAcao,
                        responsavel: respId,
                        instituicao: element.row.Instituicao,
                        descricao: element.row.MaisInformacoes,
                        status: element.row.StatusAcao,
                        link_web: element.row.LinkWeb,
                        link_youtube: element.row.LinkYoutube,
                        endereco: "5e8e0c48a70c853730c708c8",
                        area_aplicacao: "Outros",
                        negocio: "Outros"
                    })
                    solucao.save()
                        .then(() => { res.status(201).json({ message: 'Salvo com sucesso!' }) })
                        .catch(err => res.status(500).json({ error: err }))
                })
            });
            //res.status(200).json(dataex.data)
        }catch(err){
            res.status(500).json({message: err})
        }
    }    
    init();
})

router.get('/puxarDados', (req, res) => {
    const init = async() => {
        try{
            const dataex = await axios.get('http://prpi.ifce.edu.br/nl/acoescovidws');
            
            const arr = [];

            dataex.data.posts.forEach(element =>{

                const solucao = {
                    nome: element.row.NomeDaAcao,
                    tipo: element.row.TipoDeAcao,
                    responsavel: element.row.Responsavel,
                    instituicao: element.row.Instituicao,
                    descricao: element.row.MaisInformacoes,
                    status: element.row.StatusAcao,
                    link_web: element.row.LinkWeb,
                    link_youtube: element.row.LinkYoutube,
                    endereco: "5e8e0c48a70c853730c708c8",
                    area_aplicacao: "Outros",
                    negocio: "Outros"
                }

                arr.push(solucao);

                //console.log(solucao)
                //res.status(200).json(solucao)

            })
            
            res.status(200).json(arr)

        }catch(err){
            res.status(500).json({message: err})
        }
    }    
    init();
})
    //.then(dataex => console.log(dataex))

module.exports = router;
//https://attacomsian.com/blog/http-requests-axios