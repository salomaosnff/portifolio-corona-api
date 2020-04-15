const mongoose = require('mongoose')
const solucao = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa', required: true },
    cidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Cidade', required: true },
    nome: { type: String, required: true },
    area_aplicacao: { type: String , required: true},
    negocio: { type: String },
    tipo: { type: String },
    instituicao: { type: String, required: true },
    inicio: { type: Date },
    fim: { type: Date },
    descricao: { type: String, required: true },
    status: { type: String, required: true },
    link_web: { type: String },
    link_youtube: { type: String },
})

module.exports = mongoose.model('Solucao', solucao)