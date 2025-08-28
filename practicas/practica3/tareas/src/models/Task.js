import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  estado: {
    type: String,
    enum: ['pendiente', 'en progreso', 'completado'],
    default: 'pendiente',
  },
  fechaCreacion: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;