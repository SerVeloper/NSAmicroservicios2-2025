const {crearContacto, obtenerContactos, obtenerContactoPorId, editarContacto, eliminarContacto} = require("../controllers/agenda_controller");

export default async function handler(req, res) {

    try {
        switch (req.method) {
            case 'POST':
                const nuevoContacto = await crearContacto(req.body);
                res.status(201).json(nuevoContacto);
                break;
            case 'GET':
                if (req.query.id) {
                    const contacto = await obtenerContactoPorId(req.query.id);
                    if (!contacto) return res.status(404).json({ message: "Contacto no encontrado" });
                    res.status(200).json(contacto);
                }
                const agendas = await obtenerContactos();
                res.status(200).json(agendas);
                break;
            case 'PUT':
                const id = req.query.id;
                const agendaData = req.body;
                const actualizado = await editarContacto(id, agendaData);
                if (!actualizado) return res.status(404).json({ message: "Contacto no encontrado" });
                res.status(200).json(actualizado);
                break;
            case 'DELETE':
                const eliminarId = req.query.id;
                const eliminado = await eliminarContacto(eliminarId);
                if (!eliminado) return res.status(404).json({ message: "Contacto no encontrado" });
                res.status(204).end();
                break;
            default:
                res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
                return res.status(405).json({ message: `Método ${req.method} no permitido` });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error interno del servidor" });
        }
}