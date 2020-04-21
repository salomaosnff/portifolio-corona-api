const mongoose = require('mongoose')
const noticias = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    titulo: { type: String, required: true },
    subtitulo: { type: String, required: true },
    data_publicacao: { type: Date, required: true },
    data_atualizacao: { type: Date, required: true },
    descricao: { type: String, required: true },
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa', required: true },
    
    palavra_chave:  [{ 
          type: mongoose.Schema.Types.ObjectId, ref: 'Palavra_chave' 
        
    }],
   


})

module.exports = mongoose.model('Noticias', noticias)
