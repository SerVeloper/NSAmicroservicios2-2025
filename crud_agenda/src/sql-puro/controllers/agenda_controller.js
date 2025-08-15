const pool = require('../config/db');

// Crear un nuevo contacto
const crearContacto = async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    // Validación de campos obligatorios
    if (!nombres || !apellidos || !fecha_nacimiento || !celular || !correo) {
        return res.status(400).json({ error: 'Los campos nombres, apellidos, fecha_nacimiento, celular y correo son obligatorios.' });
    }
    // Validación del formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }
    try {
        const query = 'INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [nombres, apellidos, fecha_nacimiento, direccion || null, celular, correo];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El correo ya está en uso.' });
        }
        console.error('Error al crear contacto:', error);
        res.status(500).json({ error: 'Error al crear contacto.' });
    }
};

// Listar todos los contactos
const obtenerContactos = async (req, res) => {
    try {
        const query = 'SELECT * FROM agenda ORDER BY id ASC';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener contactos:', error);
        res.status(500).json({ error: 'Error al obtener contactos.' });
    }
};

// Obtener un contacto por ID
const obtenerContactoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM agenda WHERE id = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener contacto por ID:', error);
        res.status(500).json({ error: 'Error al obtener contacto.' });
    }
};

// Actualizar un contacto
const editarContacto = async (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    // Validación de campos obligatorios
    if (!nombres || !apellidos || !fecha_nacimiento || !celular || !correo) {
        return res.status(400).json({ error: 'Los campos nombres, apellidos, fecha_nacimiento, celular y correo son obligatorios.' });
    }
    // Validación del formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }
    try {
        const query = 'UPDATE agenda SET nombres = $1, apellidos = $2, fecha_nacimiento = $3, direccion = $4, celular = $5, correo = $6 WHERE id = $7 RETURNING *';
        const values = [nombres, apellidos, fecha_nacimiento, direccion || null, celular, correo, id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El correo ya está en uso.' });
        }
        console.error('Error al editar contacto:', error);
        res.status(500).json({ error: 'Error al editar contacto.' });
    }
};

// Eliminar un contacto
const eliminarContacto = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM agenda WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado.' });
        }
        res.status(200).json({ message: 'Contacto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar contacto:', error);
        res.status(500).json({ error: 'Error al eliminar contacto.' });
    }
};

// Renderizar lista de contactos en la vista EJS
const renderizarContactos = async (req, res) => {
    try {
        const query = 'SELECT * FROM agenda ORDER BY id ASC';
        const result = await pool.query(query);
        res.render('index', { contactos: result.rows });
    } catch (error) {
        console.error('Error al renderizar contactos:', error);
        res.status(500).send('Error del servidor.');
    }
};

// Renderizar formulario de creación de contacto
const renderizarFormularioCreacion = (req, res) => {
    res.render('form', { contacto: null, error: null });
};

// Manejar envío de formulario de creación de contacto
const manejarEnvioFormularioCreacion = async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    // Validación de campos obligatorios
    if (!nombres || !apellidos || !fecha_nacimiento || !celular || !correo) {
        return res.status(400).render('form', { contacto: req.body, error: 'Los campos nombres, apellidos, fecha_nacimiento, celular y correo son obligatorios.' });
    }
    // Validación del formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).render('form', { contacto: req.body, error: 'El correo no tiene un formato válido' });
    }
    try {
        const query = 'INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [nombres, apellidos, fecha_nacimiento, direccion || null, celular, correo];
        await pool.query(query, values);
        res.redirect('/');
    } catch (error) {
        let errorMessage = 'Error al crear contacto.';
        if (error.code === '23505') {
            errorMessage = 'El correo ya está en uso.';
        }
        console.error('Error al crear contacto desde el formulario:', error);
        res.status(400).render('form', { contacto: req.body, error: errorMessage });
    }
};

// Renderizar formulario de edición de contacto
const renderizarFormularioEdicion = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM agenda WHERE id = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Contacto no encontrado.');
        }
        res.render('form', { contacto: result.rows[0], error: null });
    } catch (error) {
        console.error('Error al renderizar formulario de edición:', error);
        res.status(500).send('Error del servidor.');
    }
};

// Manejar envío de formulario de edición de contacto
const manejarEnvioFormularioEdicion = async (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    // Validación de campos obligatorios
    if (!nombres || !apellidos || !fecha_nacimiento || !celular || !correo) {
        return res.status(400).render('form', { contacto: { id, ...req.body }, error: 'Los campos nombres, apellidos, fecha_nacimiento, celular y correo son obligatorios.' });
    }
    // Validación del formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).render('form', { contacto: { id, ...req.body }, error: 'El correo no tiene un formato válido' });
    }
    try {
        const query = 'UPDATE agenda SET nombres = $1, apellidos = $2, fecha_nacimiento = $3, direccion = $4, celular = $5, correo = $6 WHERE id = $7 RETURNING *';
        const values = [nombres, apellidos, fecha_nacimiento, direccion || null, celular, correo, id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).send('Contacto no encontrado.');
        }
        res.redirect('/');
    } catch (error) {
        let errorMessage = 'Error al editar contacto.';
        if (error.code === '23505') {
            errorMessage = 'El correo ya está en uso.';
        }
        console.error('Error al editar contacto desde el formulario:', error);
        res.status(400).render('form', { contacto: { id, ...req.body }, error: errorMessage });
    }
};

// Manejar eliminación de contacto desde la vista
const manejarEliminacionContacto = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM agenda WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Contacto no encontrado.');
        }
        res.redirect('/');
    } catch (error) {
        console.error('Error al eliminar contacto desde la vista:', error);
        res.status(500).send('Error del servidor.');
    }
};

module.exports = {
    crearContacto,
    obtenerContactos,
    obtenerContactoPorId,
    editarContacto,
    eliminarContacto,
    renderizarContactos,
    renderizarFormularioCreacion,
    manejarEnvioFormularioCreacion,
    renderizarFormularioEdicion,
    manejarEnvioFormularioEdicion,
    manejarEliminacionContacto
};