import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// GET: Listar todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('index', { tasks });
  } catch (error) {
    console.error('Error al obtener tareas:', error.message);
    res.status(500).send('Error al obtener tareas: ' + error.message);
  }
});

// GET: Mostrar formulario para nueva tarea
router.get('/nuevo', (req, res) => {
  res.render('form', { task: null });
});

// GET: Mostrar formulario para editar tarea
router.get('/editar/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Tarea no encontrada');
    res.render('form', { task });
  } catch (error) {
    console.error('Error al obtener la tarea:', error.message);
    res.status(500).send('Error al obtener la tarea: ' + error.message);
  }
});

// POST: Crear una nueva tarea
router.post('/nuevo', async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;
    const newTask = new Task({ titulo, descripcion, estado });
    await newTask.save();
    res.redirect('/tasks');
  } catch (error) {
    console.error('Error al crear la tarea:', error.message);
    res.status(500).send('Error al crear la tarea: ' + error.message);
  }
});

// POST: Actualizar una tarea
router.post('/editar/:id', async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion, estado },
      { new: true, runValidators: true }
    );
    if (!updatedTask) return res.status(404).send('Tarea no encontrada');
    res.redirect('/tasks');
  } catch (error) {
    console.error('Error al actualizar la tarea:', error.message);
    res.status(500).send('Error al actualizar la tarea: ' + error.message);
  }
});

// POST: Eliminar una tarea
router.post('/eliminar/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).send('Tarea no encontrada');
    res.redirect('/tasks');
  } catch (error) {
    console.error('Error al eliminar la tarea:', error.message);
    res.status(500).send('Error al eliminar la tarea: ' + error.message);
  }
});

export default router;