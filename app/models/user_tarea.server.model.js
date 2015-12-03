var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserTareaSchema = new Schema({
  creado: {
    type: Date,
    default: Date.now
  },
  id_Tarea: {
    type: Schema.ObjectId,
    ref: 'Tarea'
  },
  id_Usuario: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('UserTarea', UserTareaSchema);