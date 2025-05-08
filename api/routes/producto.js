const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.post('/', async (req, res) => {
  const { nombre, precio, imagen } = req.body;
  
  if (!nombre || !precio) {
    return res.status(400).json({ error: 'El nombre y precio son obligatorios' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, precio, imagen) VALUES (?, ?, ?)',
      [nombre, precio, imagen || null]
    );
    res.status(201).json({ 
      id: result.insertId,
      nombre,
      precio,
      imagen 
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

router.put('/:id', async (req, res) => {
  const { nombre, precio, imagen } = req.body;
  const id = req.params.id;
  
  if (!nombre || !precio) {
    return res.status(400).json({ error: 'El nombre y precio son obligatorios' });
  }
  
  try {
    const [result] = await pool.query(
      'UPDATE productos SET nombre = ?, precio = ?, imagen = ? WHERE id = ?',
      [nombre, precio, imagen || null, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ id, nombre, precio, imagen });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;