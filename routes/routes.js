const express = require('express')
const pool = require('../lib/database')
const router = express.Router()

router.get('/api/get_assistances', async(req,res) =>{
    try {
         // Realiza la consulta a la base de datos para obtener todos los trabajadores
        const result = await pool.query("select d.departameto, concat(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) as nombre_completo, te.ubicacion, a.fecha_asistencia, a.hora_asistencia from asistencias a join  "+
                "trabajadores t on a.id_trabajador = t.id join departamentos d on t.id_departamento = d.id join terminales te on a.id_terminal = te.id;");
        
        // Si no hay trabajadores, enviamos un mensaje vacío
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron trabajadores' });
        }

        // Enviamos la respuesta con los trabajadores obtenidos
        res.status(200).json(result.rows);
    } catch (error) {
        
    }
})

router.get('/api/get_assistances/:id', async(req,res) =>{
    try {
        const id = req.params.id;
         // Realiza la consulta a la base de datos para obtener todos los trabajadores
        const result = await pool.query("select d.departameto, concat(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) as nombre_completo, te.ubicacion, a.fecha_asistencia, a.hora_asistencia from asistencias a join  "+
                "trabajadores t on a.id_trabajador = t.id join departamentos d on t.id_departamento = d.id join terminales te on a.id_terminal = te.id where t.id = "+id );
        
        // Si no hay trabajadores, enviamos un mensaje vacío
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron asisitencias' });
        }

        // Enviamos la respuesta con los trabajadores obtenidos
        res.status(200).json(result.rows);
    } catch (error) {
        
    }
})

router.get('/api/workers', async (req,res) => {
    try {
        // Realiza la consulta a la base de datos para obtener todos los trabajadores
        const result = await pool.query('SELECT * FROM trabajadores');
        
        // Si no hay trabajadores, enviamos un mensaje vacío
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron trabajadores' });
        }

        // Enviamos la respuesta con los trabajadores obtenidos
        res.status(200).json(result.rows);

    } catch (error) {
        // En caso de error en la consulta, respondemos con un error 500
        console.error('Error al obtener trabajadores:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener los trabajadores', "detail": error });
    }
})

router.get('/api/workers/:clave', async (req,res) => {
    try {
        // Realiza la consulta a la base de datos para obtener todos los trabajadores
        const clave = req.params.clave;
        const result = await pool.query('SELECT * FROM trabajadores WHERE clave = $1', [clave]);

        // Si no hay trabajadores, enviamos un mensaje vacío
        if (result.rows.length === 0) {
            const clave = 'clave_desconocida'
            const result = await pool.query('SELECT * FROM trabajadores WHERE clave = $1', [clave]);
            const trabajador = result.rows[0];
            const id_trabajador = trabajador.id;

            const id_terminal = 1; // Puedes cambiar esto por req.query.id_terminal si lo mandas desde el ESP32

            const fecha = new Date();
            const fecha_asistencia = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
            const hora_asistencia = fecha.toTimeString().split(' ')[0]; // HH:MM:SS

            await pool.query(
                'INSERT INTO asistencias (fecha_asistencia, hora_asistencia, id_trabajador, id_terminal) VALUES ($1, $2, $3, $4)',
                [fecha_asistencia, hora_asistencia, id_trabajador, id_terminal]
            );
            return res.status(200).json({ message: 'Asistencia registrada', trabajador });
        }else{
            const trabajador = result.rows[0];
            const id_trabajador = trabajador.id;

            const id_terminal = 1; // Puedes cambiar esto por req.query.id_terminal si lo mandas desde el ESP32

            const fecha = new Date();
            const fecha_asistencia = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
            const hora_asistencia = fecha.toTimeString().split(' ')[0]; // HH:MM:SS

            await pool.query(
                'INSERT INTO asistencias (fecha_asistencia, hora_asistencia, id_trabajador, id_terminal) VALUES ($1, $2, $3, $4)',
                [fecha_asistencia, hora_asistencia, id_trabajador, id_terminal]
            );
            return res.status(200).json({ message: 'Asistencia registrada', trabajador });
        }
            
            
        

        

    } catch (error) {
        // En caso de error en la consulta, respondemos con un error 500
        console.error('Error al obtener trabajadores:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener los trabajadores', "detail": error });
    }
})

module.exports = router;