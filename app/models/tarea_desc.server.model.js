var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var tipos = 'En Espera,En proceso,En Pausa,Terminada,Cancelada'.split(',');

var TareaDescSchema = new Schema({
  creado: {
    type: Date,
    default: Date.now
  },
  descripcion: {
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
  tarea_id: {
    type: Schema.ObjectId,
    ref: 'Tarea'
  },
});

mongoose.model('TareaDesc', TareaDescSchema);