const AppDataSource = require("../config/db").AppDataSource;

const agendaRepository = AppDataSource.getRepository("Agenda");

// Crear un nuevo contacto
async function crearContacto(agendaData) {
    const contacto = agendaRepository.create(agendaData);
    return await agendaRepository.save(contacto);
}

// Obtener todos los contactos
async function obtenerContactos() {
    return await agendaRepository.find();
}

// Obtener un contacto por ID
async function obtenerContactoPorId(id) {
    return await agendaRepository.findOneBy({ id });
}

// Actualizar un contacto
async function editarContacto(id, agendaData) {
    const agenda = await agendaRepository.findOneBy({ id });
    if (!agenda) return null;
    agendaRepository.merge(agenda, agendaData);
    return await agendaRepository.save(agenda);
}

// Eliminar un contacto
async function eliminarContacto(id) {
    const agenda = await agendaRepository.findOneBy({ id });
    if (!agenda) return null;
    return await agendaRepository.remove(agenda);
}

module.exports = {
    crearContacto,
    obtenerContactos,
    obtenerContactoPorId,
    editarContacto,
    eliminarContacto
};