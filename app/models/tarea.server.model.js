var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
  creador: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Tarea', TareaSchema);