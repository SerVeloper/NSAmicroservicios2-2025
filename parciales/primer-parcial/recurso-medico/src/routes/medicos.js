const express = require('express');
const { AppDataSource } = require('../config/database');
const Medico = require('../entities/medico.entity');

const router = express.Router();
const medicoRepository = AppDataSource.getRepository(Medico);

// GET: Obtener todos los médicos
router.get('/', async (req, res) => {
  try {
    const medicos = await medicoRepository.find();
    res.json(medicos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Obtener un médico por ID
router.get('/:id', async (req, res) => {
  try {
    const medico = await medicoRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });
    res.json(medico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Crear un médico
router.post('/', async (req, res) => {
  try {
    const { nombre, apellido, cedula_profesional, especialidad, anos_experiencia, correo_electronico } = req.body;
    const medico = medicoRepository.create({
      nombre,
      apellido,
      cedula_profesional,
      especialidad,
      anos_experiencia,
      correo_electronico,
    });
    const result = await medicoRepository.save(medico);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Actualizar un médico por ID
router.put('/:id', async (req, res) => {
  try {
    const medico = await medicoRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });
    const { nombre, apellido, cedula_profesional, especialidad, anos_experiencia, correo_electronico } = req.body;
    Object.assign(medico, { nombre, apellido, cedula_profesional, especialidad, anos_experiencia, correo_electronico });
    const result = await medicoRepository.save(medico);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Eliminar un médico por ID
router.delete('/:id', async (req, res) => {
  try {
    const medico = await medicoRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });
    await medicoRepository.remove(medico);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;