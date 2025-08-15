const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { 
    crearContacto, 
    obtenerContactos,
    obtenerContactoPorId, 
    editarContacto, eliminarContacto, 
    renderizarContactos, 
    renderizarFormularioCreacion, 
    manejarEnvioFormularioCreacion, 
    manejarEnvioFormularioEdicion, 
    renderizarFormularioEdicion, 
    manejarEliminacionContacto 
    } = require('../controllers/agenda_controller');

//Api REST
router.post('/api/contactos', crearContacto);
router.get('/api/contactos', obtenerContactos);
router.get('/api/contactos/:id', obtenerContactoPorId);
router.put('/api/contactos/:id', editarContacto);
router.delete('/api/contactos/:id', eliminarContacto);

//Vistas EJS
router.get('/', renderizarContactos);
router.get('/crear', renderizarFormularioCreacion);
router.post('/crear', manejarEnvioFormularioCreacion);
router.get('/editar/:id', renderizarFormularioEdicion);
router.post('/editar/:id', manejarEnvioFormularioEdicion);
router.post('/eliminar/:id', manejarEliminacionContacto);

module.exports = router;