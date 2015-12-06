var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var tipos = 'En Espera,En proceso,En Pausa,Terminada,Cancelada'.split(',');

var TareaSchema = new Schema({
  creado: {
    type: Date,
    default: Date.now
  },
  titulo: {
    type: String,
    default: '',
    trim: true,
    required: 'El título no puede estar en blanco'
  },
  descripcion: {
    type: String,
    default: '',
    trim: true,
  },
  users_ids: {
    type: String,
    default: '',
    trim: true,
  },
  terminado: {
    type: Date,
  },
  terminadoCompromiso: {
    type: Date,
    required: 'Fecha Tentantiva obligatoria'
  },
  status:{
    type: String,
    enum: tipos
  },
  creador: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Tarea', TareaSchema);